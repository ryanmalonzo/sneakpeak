import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { SneakerRepository } from '../../app/repositories/sql/SneakerRepository';
import { Sneaker, SneakerDTO } from '../../app/models/sql/Sneaker';
import { SneakerService } from '../../app/services/SneakerService';

use(chaiAsPromised);

afterEach(() => {
  sinon.restore();
});

const SNEAKER_DTO = {
  name: 'TestUnit',
  description: 'desc',
  price: 10.99,
  categoryId: 1,
  brandId: 1,
} as SneakerDTO;

const SNEAKER = {
  name: 'TestUnit',
  description: 'desc',
  price: 10.99,
  categoryId: 1,
  brandId: 1,
} as Sneaker;

describe('SneakerService', () => {
  describe('create', () => {
    it('should create a new sneaker', async () => {
      sinon.stub(SneakerService, 'isSneakerExists').resolves(false);
      sinon.stub(SneakerRepository, 'create').resolves(SNEAKER);

      await expect(SneakerService.create(SNEAKER_DTO)).to.be.fulfilled;
    });

    it('should throw an error if sneaker already exists', async () => {
      sinon.stub(SneakerService, 'isSneakerExists').resolves(true);

      await expect(SneakerService.create(SNEAKER_DTO)).to.be.rejected;
    });
  });

  describe('fullUpdate', () => {
    it('should update a sneaker if it exists', async () => {
      sinon.stub(SneakerRepository, 'fullUpdate').resolves({
        nbDeleted: 1,
        updatedSneaker: SNEAKER,
      });

      await expect(SneakerService.fullUpdate('1', SNEAKER_DTO)).to.be.fulfilled;
    });

    it('should create a new sneaker if it does not exist', async () => {
      sinon.stub(SneakerRepository, 'fullUpdate').resolves({
        nbDeleted: 0,
        updatedSneaker: SNEAKER,
      });

      await expect(SneakerService.fullUpdate('1', SNEAKER_DTO)).to.be.fulfilled;
    });
  });

  describe('partialUpdate', () => {
    it('should update a sneaker', async () => {
      sinon.stub(SneakerRepository, 'partialUpdate').resolves(SNEAKER);

      await expect(SneakerService.partialUpdate(1, SNEAKER_DTO)).to.be
        .fulfilled;
    });

    it('should throw an error if sneaker does not exist', async () => {
      sinon.stub(SneakerRepository, 'partialUpdate').resolves(null);

      await expect(SneakerService.partialUpdate(1, SNEAKER_DTO)).to.be.rejected;
    });
  });

  describe('isSneakerExists', () => {
    it('should return true if sneaker exists', async () => {
      sinon.stub(SneakerRepository, 'findSnearkerByName').resolves(SNEAKER);

      await expect(SneakerService.isSneakerExists(SNEAKER_DTO)).to.eventually.be
        .true;
    });

    it('should return false if sneaker does not exist', async () => {
      sinon.stub(SneakerRepository, 'findSnearkerByName').resolves(null);

      await expect(SneakerService.isSneakerExists(SNEAKER_DTO)).to.eventually.be
        .false;
    });
  });

  describe('delete', () => {
    it('should delete a sneaker', async () => {
      sinon.stub(SneakerRepository, 'delete').resolves(1);

      await expect(SneakerService.delete(1)).to.be.fulfilled;
    });
  });
});
