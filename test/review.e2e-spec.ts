import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { USER_NOT_EXIST_MESSAGE } from '../src/auth/auth.constants';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Тест',
  title: 'Заголовок',
  description: 'Описание тестовое',
  rating: 5,
  productId,
};

const testUser: AuthDto = {
  login: 'qwerty@mail.ru',
  password: 'qwerty',
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication<App>;
  let createdId: string;
  let userId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const userResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);
    userId = userResponse.body._id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser);
    token = loginResponse.body.access_token;
  });

  it('/review/create (POST) success', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    createdId = response.body._id;
    expect(createdId).toBeDefined();
  });

  it('/review/create (POST) fail', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send({
        ...testDto,
        name: 1,
        rating: 0,
      })
      .expect(400);
    console.log(response.body);
  });

  it('/review/product/:productId (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/review/product/${productId}`)
      .expect(200);

    expect(response.body.length).toBe(1);
  });

  it('/review/product/:productId (GET) empty', async () => {
    const response = await request(app.getHttpServer())
      .get(`/review/product/${new Types.ObjectId().toHexString()}`)
      .expect(200);

    expect(response.body.length).toBe(0);
  });

  it('/review/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body._id).toBe(createdId);
  });

  it('/review/:id (DELETE) not exist', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/review/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: REVIEW_NOT_FOUND,
    });
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/auth/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser);
    expect(response.body).toEqual({
      statusCode: 401,
      message: USER_NOT_EXIST_MESSAGE,
      error: 'Unauthorized',
    });
    disconnect();
  });
});
