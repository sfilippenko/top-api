import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { disconnect } from 'mongoose';
import { CreateProductDto } from '../src/product/dto/create-product.dto';
import { AuthDto } from '../src/auth/dto/auth.dto';

const createMilkProductDto: CreateProductDto = {
  image: 'milk.png',
  title: 'Milk',
  link: 'link string',
  initialRating: 5,
  price: 130,
  oldPrice: 130,
  credit: 10,
  description: 'milk desk',
  advantages: 'adv',
  disAdvantages: 'dis adv',
  tags: [],
  characteristics: [],
  categories: ['food'],
};

const goodReview: Omit<CreateReviewDto, 'productId'> = {
  name: 'good',
  title: 'good',
  description: 'good',
  rating: 5,
};

const badReview: Omit<CreateReviewDto, 'productId'> = {
  name: 'bad',
  title: 'bad',
  description: 'bad',
  rating: 1,
};

const testUser: AuthDto = {
  login: 'qwerty2@mail.ru',
  password: 'qwerty',
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication<App>;
  let milkId: string;
  let goodReviewId: string;
  let badReviewId: string;
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

  it('/product/create (POST) add milk', async () => {
    const response = await request(app.getHttpServer())
      .post('/product/create')
      .send(createMilkProductDto)
      .expect(201);

    milkId = response.body._id;
    expect(milkId).toBeDefined();
  });

  it('/product/:id (PATCH) change description', async () => {
    const newDescription = 'new description';
    const response = await request(app.getHttpServer())
      .patch(`/product/${milkId}`)
      .send({
        description: newDescription,
      })
      .expect(200);

    expect(response.body.description).toBe(newDescription);
  });

  it('/product/:id (PATCH) change back', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/product/${milkId}`)
      .send({
        description: createMilkProductDto.description,
      })
      .expect(200);

    expect(response.body.description).toBe(createMilkProductDto.description);
  });

  it('/review/:id (PATCH) add reviews', async () => {
    const goodReviewResponse = await request(app.getHttpServer())
      .post('/review/create')
      .send({
        ...goodReview,
        productId: milkId,
      })
      .expect(201);
    goodReviewId = goodReviewResponse.body._id;

    const badReviewResponse = await request(app.getHttpServer())
      .post('/review/create')
      .send({
        ...badReview,
        productId: milkId,
      })
      .expect(201);

    badReviewId = badReviewResponse.body._id;
  });

  it('/product/find (POST) no products found', async () => {
    const response = await request(app.getHttpServer())
      .post('/product/find')
      .send({
        category: 'some',
        limit: 1,
      });
    expect(response.body).toEqual([]);
  });

  it('/product/find (POST) products found', async () => {
    const response = await request(app.getHttpServer())
      .post('/product/find')
      .send({
        category: 'food',
        limit: 1,
      });

    expect(response.body).toMatchObject([
      {
        ...createMilkProductDto, // Проверяем, что все поля из DTO есть
        _id: milkId, // Проверяем конкретное значение `_id`
        reviews: expect.arrayContaining([
          // Проверяем массив (порядок не важен)
          expect.objectContaining({
            ...goodReview, // Проверяем часть полей отзыва
            _id: goodReviewId, // + конкретное значение `_id`
          }),
          expect.objectContaining({
            ...badReview,
            _id: badReviewId,
          }),
        ]),
        reviewCount: 2, // Проверяем точное количество
        reviewAvg: (goodReview.rating + badReview.rating) / 2,
      },
    ]);
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/product/${milkId}`);
    await request(app.getHttpServer())
      .delete(`/review/${goodReviewId}`)
      .set('Authorization', `Bearer ${token}`);
    await request(app.getHttpServer())
      .delete(`/review/${badReviewId}`)
      .set('Authorization', `Bearer ${token}`);
    await request(app.getHttpServer())
      .delete(`/auth/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    await disconnect();
  });
});
