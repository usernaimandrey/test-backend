import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const PORT = process.env.PORT || 3000
  await app.listen(PORT, () => console.log(`Server has been started on ${PORT} port`))
}
bootstrap()
