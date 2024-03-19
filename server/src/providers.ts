import { ConfigModule, ConfigService } from "@nestjs/config";
import { CognitoAuthModule } from "@nestjs-cognito/auth";
import type { DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

export const providers: DynamicModule[] = [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  CognitoAuthModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      jwtVerifier: {
        userPoolId: configService.get("COGNITO_USER_POOL_ID"),
        clientId: configService.get("COGNITO_CLIENT_ID"),
        tokenUse: "id",
      },
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get("DATABASE_URL"),
    }),
    inject: [ConfigService],
  }),
];
