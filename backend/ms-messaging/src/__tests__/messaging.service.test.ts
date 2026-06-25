import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  createConversation: mock(() => undefined),
  addParticipant: mock(() => undefined),
  findConversationByParticipants: mock(() => undefined),
  listConversations: mock(() => undefined),
  getParticipants: mock(() => undefined),
  sendMessage: mock(() => undefined),
  getMessages: mock(() => undefined),
  markAsRead: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/messaging.repository.js', () => ({
  MessagingRepository: function () { return mockRepo; },
}));

const { MessagingService } = await import('../services/messaging.service.js');

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    service = new MessagingService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('getOrCreateConversation', () => {
    const data = {
      participantIds: ['1', '2'],
      participantNames: ['Juan', 'Maria'],
      participantLastNames: ['Perez', 'Lopez'],
      participantRoles: ['profesor', 'apoderado'],
    };

    it('should return existing conversation if it already exists', async () => {
      mockRepo.findConversationByParticipants.mockResolvedValue({ id: 1 });
      const result = await service.getOrCreateConversation(data);
      expect(result).toEqual({ id: 1 });
      expect(mockRepo.createConversation).not.toHaveBeenCalled();
    });

    it('should create new conversation if it does not exist', async () => {
      mockRepo.findConversationByParticipants.mockResolvedValue(null);
      mockRepo.createConversation.mockResolvedValue({ id: 5 });
      const result = await service.getOrCreateConversation(data);
      expect(result).toEqual({ id: 5 });
      expect(mockRepo.createConversation).toHaveBeenCalled();
      expect(mockRepo.addParticipant).toHaveBeenCalledTimes(2);
    });
  });

  describe('listConversations', () => {
    it('should return conversations for user', async () => {
      mockRepo.listConversations.mockResolvedValue([{ id: 1 }]);
      const result = await service.listConversations('1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getParticipants', () => {
    it('should return participants of a conversation', async () => {
      mockRepo.getParticipants.mockResolvedValue([{ userId: '1' }]);
      const result = await service.getParticipants(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('sendMessage', () => {
    const data = {
      conversationId: 1,
      senderId: '1',
      senderName: 'Juan',
      senderLastName: 'Perez',
      senderRole: 'profesor',
      content: 'Hola',
    };

    it('should send a message successfully', async () => {
      mockRepo.sendMessage.mockResolvedValue({ id: 1, ...data, read: false });
      const result = await service.sendMessage(data);
      expect(result.id).toBe(1);
      expect(mockRepo.sendMessage).toHaveBeenCalledWith({
        conversationId: 1,
        senderId: '1',
        senderName: 'Juan',
        senderLastName: 'Perez',
        senderRole: 'profesor',
        content: 'Hola',
      });
    });
  });

  describe('getMessages', () => {
    it('should return messages of a conversation', async () => {
      mockRepo.getMessages.mockResolvedValue([{ id: 1, content: 'Hola' }]);
      const result = await service.getMessages(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('markAsRead', () => {
    it('should mark messages as read', async () => {
      await service.markAsRead(1, '1');
      expect(mockRepo.markAsRead).toHaveBeenCalledWith(1, '1');
    });
  });
});
