import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import ParamsWithId from 'src/utils/paramsWithId';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { OwnerGuard } from './guards/owner.guard';

@ApiTags('Boxes')
@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() createBoxDto: CreateBoxDto, @Request() req) {
    return this.boxesService.create(createBoxDto, req.user);
  }

  @Get()
  findAll() {
    return this.boxesService.findAll();
  }

  @Post(':id/upload-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param() { id }: ParamsWithId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const savedBox = await this.boxesService.uploadFile(id, file);
    return savedBox;
  }

  @Get(':id')
  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  findOne(@Param() { id }: ParamsWithId) {
    return this.boxesService.findOne(+id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch(':id')
  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  update(
    @Param() { id }: ParamsWithId,
    @Body() updateBoxDto: UpdateBoxDto,
    @Request() req,
  ) {
    return this.boxesService.update(id, updateBoxDto, req.user);
  }

  @Patch(':id/set-to-public')
  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @UseGuards(OwnerGuard)
  @UseGuards(JwtAuthGuard)
  setToPublic(@Param() { id }: ParamsWithId) {
    return this.boxesService.setToPublic(id);
  }

  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @Delete(':id')
  remove(@Param() { id }: ParamsWithId) {
    return this.boxesService.remove(+id);
  }
}
