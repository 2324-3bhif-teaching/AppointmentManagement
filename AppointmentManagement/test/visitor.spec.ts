import { deleteQueue, getPosition } from '../public/scripts/visitor';
import { fetchRestEndpoint, loadQueues } from '../public/scripts/visitor';

jest.mock('../public/scripts/visitor', () => ({
    fetchRestEndpoint: jest.fn(),
    loadQueues: jest.fn()
}));

describe('deleteQueue', () => {
    it('should delete the queue and reload the queues', async () => {
        (fetchRestEndpoint as unknown as jest.Mock).mockResolvedValueOnce({});
        (loadQueues as unknown as jest.Mock).mockResolvedValueOnce({});

        await deleteQueue(1, 1);

        expect(fetchRestEndpoint).toHaveBeenCalledWith('http://localhost:3000/api/visitor/queues/1/visitor/1', 'DELETE');
        expect(loadQueues).toHaveBeenCalled();
    });

    it('should log an error if the fetch fails', async () => {
        (fetchRestEndpoint as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

        console.error = jest.fn();

        await deleteQueue(1, 1);

        expect(console.error).toHaveBeenCalledWith('Error:', new Error('Fetch failed'));
    });
});

describe('getPosition', () => {
    it('should return the position of the visitor in the queue', async () => {
        (fetchRestEndpoint as jest.Mock).mockResolvedValueOnce({ position: 1 });

        const position = await getPosition(1, 1);

        expect(position).toBe(1);
        expect(fetchRestEndpoint).toHaveBeenCalledWith('http://localhost:3000/api/visitor/waitingPositions/visitor/1/queue/1', 'GET');
    });

    it('should return 0 and log an error if the fetch fails', async () => {
        (fetchRestEndpoint as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

        console.error = jest.fn();

        const position = await getPosition(1, 1);

        expect(position).toBe(0);
        expect(console.error).toHaveBeenCalledWith('Error:', new Error('Fetch failed'));
    });
});