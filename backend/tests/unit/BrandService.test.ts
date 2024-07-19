import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { BrandService } from '../../app/services/BrandService';
import { BrandRepository } from '../../app/repositories/sql/BrandRepository';
import { BrandRepository as BrandRepositoryMongoDB } from '../../app/repositories/mongodb/BrandRepository';
import { Brand } from '../../app/models/sql/Brand';
import { HydratedDocument } from 'mongoose';
import { IBrand } from '../../app/models/mongodb/Brand';

use(chaiAsPromised);

afterEach(() => {
  sinon.restore();
});

describe('BrandService', () => {
  describe('findAll', () => {
    it('should return all brands', async () => {
      const brands = [
        { id: 1, name: 'Nike', slug: 'nike', image: '' },
        { id: 2, name: 'Adidas', slug: 'adidas', image: '' },
      ] as HydratedDocument<IBrand>[];
      sinon.stub(BrandRepositoryMongoDB, 'findAll').resolves(brands);

      const result = await BrandService.findAll();

      expect(result).to.deep.equal(brands);
    });
  });

  describe('save', () => {
    it('should save a brand', async () => {
      const brand = {
        id: 1,
        name: 'Nike',
        image: 'https://example.com/nike.png',
      } as Brand;
      sinon.stub(BrandRepository, 'build').returns(brand);
      sinon.stub(BrandRepository, 'save').resolves(brand);

      const result = await BrandService.save(brand.name, brand.image);

      expect(result).to.deep.equal(brand);
    });
  });

  describe('createOrUpdate', () => {
    it('should create a brand', async () => {
      const brand = {
        id: 1,
        name: 'Nike',
        image: 'https://example.com/nike.png',
      } as Brand;
      sinon
        .stub(BrandRepository, 'updateOrCreate')
        .resolves({ created: true, brand });

      const result = await BrandService.createOrUpdate(
        brand.id,
        brand.name,
        brand.image,
      );

      expect(result).to.deep.equal({ created: true, brand });
    });

    it('should update a brand', async () => {
      const brand = {
        id: 1,
        name: 'Nike',
        image: 'https://example.com/nike.png',
      } as Brand;
      sinon
        .stub(BrandRepository, 'updateOrCreate')
        .resolves({ created: false, brand });

      const result = await BrandService.createOrUpdate(
        brand.id,
        brand.name,
        brand.image,
      );

      expect(result).to.deep.equal({ created: false, brand });
    });
  });

  describe('delete', () => {
    it('should delete a brand', async () => {
      const brand = {
        id: 1,
        name: 'Nike',
        image: 'https://example.com/nike.png',
      } as Brand;
      sinon.stub(BrandRepository, 'delete').resolves(brand);

      const result = await BrandService.delete(brand.id);

      expect(result).to.deep.equal(brand);
    });
  });
});
