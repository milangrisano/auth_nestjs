import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserProfileModule } from './user-profile/user-profile.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,// agregar el cambio de username por defecto para separla
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //! En produccion siempre siempre se coloca en false
    }),
    AuthModule,
    UserProfileModule,
  ],
})
export class AppModule {}
