import { Module, forwardRef } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test } from './models/test.models';
import { Variants } from 'src/variants/models/variants.models';
import { VariantsModule } from 'src/variants/variants.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [SequelizeModule.forFeature([Test]), forwardRef(() => VariantsModule), StudentModule,],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
