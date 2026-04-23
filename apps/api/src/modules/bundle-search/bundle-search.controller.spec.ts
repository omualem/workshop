import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { BundleSearchController } from "./bundle-search.controller";
import { BundleSearchService } from "./bundle-search.service";

describe("BundleSearchController", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BundleSearchController],
      providers: [
        {
          provide: BundleSearchService,
          useValue: {
            create: jest.fn().mockResolvedValue({ searchId: "demo" }),
            getSearch: jest.fn(),
            getResults: jest.fn(),
            recompute: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects invalid bundle search payloads", async () => {
    await request(app.getHttpServer()).post("/bundle-search").send({ requestedItems: [] }).expect(400);
  });

  it("accepts valid bundle search payloads", async () => {
    await request(app.getHttpServer())
      .post("/bundle-search")
      .send({
        requestedItems: [
          {
            slotKey: "camera",
            categoryId: "11111111-1111-4111-8111-111111111112",
            quantity: 1,
            optional: false,
            constraints: {},
          },
        ],
        dateRange: {
          startDate: new Date("2026-05-01").toISOString(),
          endDate: new Date("2026-05-03").toISOString(),
        },
        renterLocation: {
          lat: 32.08,
          lng: 34.78,
          addressText: "Tel Aviv",
        },
        preferenceProfile: "balanced",
        sameLenderPreferred: true,
        deliveryPreferred: false,
        exactDatesOnly: true,
      })
      .expect(201);
  });
});
