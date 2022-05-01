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
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { OwnerGuard } from './guards/owner.guard';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';
import { SuperUserGuard } from 'src/boxes/guards/super-user.guard';
import { OrGuard } from '@nest-lab/or-guard';
import { ShareBoxDto } from './dto/share-box.dto';
import { PublicAccessibleGuard } from './guards/public-accessible.guard';
import { AllowedUserGuard } from './guards/allowed-user.guard';

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
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Request() req) {
    return this.boxesService.findAll(req.user);
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
  @UseGuards(
    OrGuard([PublicAccessibleGuard, OwnerGuard], {
      throwOnFirstError: true,
    }),
  )
  @UseGuards(OptionalJwtAuthGuard)
  async uploadFile(
    @Param('id') id: string,
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
  @UseGuards(
    OrGuard(
      [PublicAccessibleGuard, OwnerGuard, AllowedUserGuard, SuperUserGuard],
      {
        throwOnFirstError: true,
      },
    ),
  )
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.boxesService.findOne(id);
  }

  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @Patch(':id')
  @UseGuards(
    OrGuard([PublicAccessibleGuard, OwnerGuard], {
      throwOnFirstError: true,
    }),
  )
  @UseGuards(OptionalJwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto) {
    return this.boxesService.update(id, updateBoxDto);
  }

  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @Patch(':id/set-to-public')
  @UseGuards(OwnerGuard)
  @UseGuards(JwtAuthGuard)
  setToPublic(@Param('id') id: string) {
    return this.boxesService.setToPublic(id);
  }

  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @Delete(':id')
  @UseGuards(
    OrGuard([SuperUserGuard, OwnerGuard], {
      throwOnFirstError: true,
    }),
  )
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.boxesService.remove(id);
  }

  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @Patch(':id/share')
  @UseGuards(OwnerGuard)
  @UseGuards(JwtAuthGuard)
  share(@Param('id') id: string, @Body() shareBoxDto: ShareBoxDto) {
    return this.boxesService.share(id, shareBoxDto);
  }
}
