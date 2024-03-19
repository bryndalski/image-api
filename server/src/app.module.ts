import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { HealthModule } from "./health/health.module";
import { ImagesModule } from "./images/images.module";
import { FileManagerModule } from "./file-manager/file-manager.module";
import { providers } from "./providers";

@Module({
  imports: [
    ...providers,
    UsersModule,
    HealthModule,
    ImagesModule,
    FileManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
