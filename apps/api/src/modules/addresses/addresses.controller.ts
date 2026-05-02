import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "@nestjs/common";
import { Public } from "../../shared/decorators/public.decorator";
import { AddressesService } from "./addresses.service";
import { GeocodingService } from "./geocoding.service";
import {
  normalizeHebrewAddressText,
} from "./address-normalization";

interface GeocodeRequestBody {
  cityId?: string;
  streetId?: string;
  addressNumber?: number;
}

@Controller("addresses")
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly geocodingService: GeocodingService,
  ) {}

  @Public()
  @Get("cities")
  async cities(@Query("q") q?: string, @Query("limit") limit?: string) {
    const data = await this.addressesService.searchCities(
      q,
      limit ? Number.parseInt(limit, 10) : 20,
    );

    return {
      success: true,
      data: data.map((city) => ({
        id: city.id,
        settlementCode: city.settlementCode,
        nameHe: city.nameHe,
      })),
    };
  }

  @Public()
  @Get("streets")
  async streets(
    @Query("cityId") cityId?: string,
    @Query("settlementCode") settlementCode?: string,
    @Query("q") q?: string,
    @Query("limit") limit?: string,
  ) {
    const data = await this.addressesService.searchStreets({
      cityId,
      settlementCode: settlementCode
        ? Number.parseInt(settlementCode, 10)
        : undefined,
      q,
      limit: limit ? Number.parseInt(limit, 10) : 20,
    });

    return {
      success: true,
      data: data.map((street) => ({
        id: street.id,
        streetCode: street.streetCode,
        nameHe: street.nameHe,
      })),
    };
  }

  @Public()
  @Post("geocode")
  async geocode(@Body() body: GeocodeRequestBody) {
    if (
      !body?.cityId ||
      !body?.streetId ||
      body.addressNumber === undefined ||
      body.addressNumber === null
    ) {
      throw new BadRequestException(
        "יש לבחור עיר, רחוב ומספר בית תקינים.",
      );
    }

    const addressNumber = Number(body.addressNumber);
    const result = await this.addressesService.geocodeRenterAddress({
      cityId: body.cityId,
      streetId: body.streetId,
      addressNumber,
    });

    return {
      success: true,
      data: {
        addressText: normalizeHebrewAddressText(result.addressText),
        lat: result.lat,
        lng: result.lng,
        provider: result.provider,
        cached: result.cached,
      },
    };
  }
}
