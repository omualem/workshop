"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateListingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const admin_create_listing_dto_1 = require("./admin-create-listing.dto");
class AdminUpdateListingDto extends (0, mapped_types_1.PartialType)(admin_create_listing_dto_1.AdminCreateListingDto) {
}
exports.AdminUpdateListingDto = AdminUpdateListingDto;
//# sourceMappingURL=admin-update-listing.dto.js.map