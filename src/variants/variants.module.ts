import { Module, forwardRef } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Variants } from './models/variants.models';
import { TestModule } from '../test/test.module';

@Module({
  imports: [SequelizeModule.forFeature([Variants]), forwardRef(() => TestModule)],
  controllers: [VariantsController],
  providers: [VariantsService], 
  exports: [VariantsService],
})
export class VariantsModule {}
