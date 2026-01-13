import { AddressService } from '../services/addressService';
import { Address } from '../domain/address';
import { InMemoryAddressRepo } from '../adapters/driven/inMemoryAddressRepo';

describe('AddressService', () => {
    let repo: InMemoryAddressRepo;
    let service: AddressService;
    
    beforeEach(() => {
        repo = new InMemoryAddressRepo();
        service = new AddressService(repo);
    });

    it('listAddresses retourne la liste fournie par le repo', async () => {
        const sample: Address[] = [new Address('Main', 'Town', 30100,'1'), new Address('Second', 'Village', 30200,'2')];
        repo.save(sample[0]);
        repo.save(sample[1]);
        await expect(service.listAddresses()).resolves.toEqual(sample);
    });

    it('getAddress retourne l\'adresse quand elle existe', async () => {
        const addr = new Address('Main', 'Town', 30100, '1');
        repo.save(addr);
        await expect(service.getAddress('1')).resolves.toEqual(addr);
    });

    it('getAddress retourne null quand l\'adresse est introuvable', async () => {
        const addr = new Address('Main', 'Town', 30100, '1');
        repo.save(addr);        
        await expect(service.getAddress('missing')).resolves.toBeNull();
    });

    it('createAddress appelle save et retourne l\'adresse créée', async () => {
        const input = new Address('New', 'City', 10100, '2');
        const { street, city, zip } = input;
        const saved = new Address(street, city, zip, '2');
        await expect(service.createAddress(input)).resolves.toEqual(saved);
    });

});
