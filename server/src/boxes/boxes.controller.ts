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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@ApiTags('Boxes')
@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @UseGuards(JwtAuthGuard)
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
  update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto) {
    return this.boxesService.update(+id, updateBoxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boxesService.remove(+id);
  }
}
