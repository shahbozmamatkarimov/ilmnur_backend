import { Module, forwardRef } from '@nestjs/common';
import { TestsService } from './test.service';
import { TestsController } from './test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tests } from './models/test.models';

@Module({
  imports: [SequelizeModule.forFeature([Tests])],
  controllers: [TestsController],
  providers: [TestsService], 
  exports: [TestsService],
})
export class TestsModule {}
