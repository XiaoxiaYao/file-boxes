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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import ParamsWithId from 'src/utils/paramsWithId';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boxesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param() { id }: ParamsWithId,
    @Body() updateBoxDto: UpdateBoxDto,
    @Request() req,
  ) {
    return this.boxesService.update(id, updateBoxDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boxesService.remove(+id);
  }
}
