import { relations } from 'drizzle-orm';
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const conditionEnum = pgEnum('book_condition', ['baru', 'baik', 'cukup', 'rusak-ringan']);
export const listingTypeEnum = pgEnum('listing_type', ['JUAL', 'BARTER', 'DONASI']);
export const bookStatusEnum = pgEnum('book_status', ['tersedia', 'proses', 'selesai', 'dibatalkan']);
export const transactionTypeEnum = pgEnum('transaction_type', ['JUAL', 'BARTER']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'disepakati', 'selesai', 'batal']);

const id = () => varchar('id', { length: 36 }).primaryKey();
const createdAt = () => timestamp('created_at', { withTimezone: true }).defaultNow().notNull();

export const users = pgTable('users', {
  id: id(), googleId: varchar('google_id', { length: 255 }).notNull(), email: varchar('email', { length: 320 }).notNull(), name: varchar('name', { length: 120 }).notNull(), avatarUrl: text('avatar_url'), phone: varchar('phone', { length: 32 }), address: varchar('address', { length: 160 }), city: varchar('city', { length: 100 }), profileCompleted: boolean('profile_completed').default(false).notNull(), createdAt: createdAt(),
}, (table) => [uniqueIndex('users_google_id_idx').on(table.googleId), uniqueIndex('users_email_idx').on(table.email)]);

export const books = pgTable('books', {
  id: id(), ownerId: varchar('owner_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }), title: varchar('title', { length: 200 }).notNull(), author: varchar('author', { length: 160 }).notNull(), condition: conditionEnum('condition').notNull(), description: text('description').notNull(), coverImageUrl: text('cover_image_url').notNull(), additionalImageUrls: text('additional_image_urls').array().notNull().default([]), listingType: listingTypeEnum('listing_type').notNull(), price: integer('price'), wantedInExchange: text('wanted_in_exchange'), status: bookStatusEnum('status').default('tersedia').notNull(), city: varchar('city', { length: 100 }).notNull(), area: varchar('area', { length: 120 }), createdAt: createdAt(), updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index('books_listing_type_idx').on(table.listingType), index('books_status_idx').on(table.status), index('books_owner_id_idx').on(table.ownerId)]);

export const transactions = pgTable('transactions', {
  id: id(), bookId: varchar('book_id', { length: 36 }).notNull().references(() => books.id, { onDelete: 'restrict' }), buyerId: varchar('buyer_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'restrict' }), sellerId: varchar('seller_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'restrict' }), type: transactionTypeEnum('type').notNull(), status: transactionStatusEnum('status').default('pending').notNull(), meetupNote: text('meetup_note'), createdAt: createdAt(), updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index('transactions_buyer_id_idx').on(table.buyerId), index('transactions_seller_id_idx').on(table.sellerId), index('transactions_book_id_idx').on(table.bookId)]);

export const conversations = pgTable('conversations', {
  id: id(), bookId: varchar('book_id', { length: 36 }).references(() => books.id, { onDelete: 'set null' }), participantOneId: varchar('participant_one_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }), participantTwoId: varchar('participant_two_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }), createdAt: createdAt(),
}, (table) => [index('conversations_participant_one_idx').on(table.participantOneId), index('conversations_participant_two_idx').on(table.participantTwoId)]);

export const messages = pgTable('messages', {
  id: id(), conversationId: varchar('conversation_id', { length: 36 }).notNull().references(() => conversations.id, { onDelete: 'cascade' }), senderId: varchar('sender_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }), content: varchar('content', { length: 2000 }).notNull(), sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(), readAt: timestamp('read_at', { withTimezone: true }),
}, (table) => [index('messages_conversation_id_idx').on(table.conversationId), index('messages_sent_at_idx').on(table.sentAt)]);

export const usersRelations = relations(users, ({ many }) => ({ books: many(books), buyerTransactions: many(transactions, { relationName: 'buyer' }), sellerTransactions: many(transactions, { relationName: 'seller' }), participantOneConversations: many(conversations, { relationName: 'participantOne' }), participantTwoConversations: many(conversations, { relationName: 'participantTwo' }), sentMessages: many(messages) }));
export const booksRelations = relations(books, ({ one, many }) => ({ owner: one(users, { fields: [books.ownerId], references: [users.id] }), transactions: many(transactions), conversations: many(conversations) }));
export const transactionsRelations = relations(transactions, ({ one }) => ({ book: one(books, { fields: [transactions.bookId], references: [books.id] }), buyer: one(users, { relationName: 'buyer', fields: [transactions.buyerId], references: [users.id] }), seller: one(users, { relationName: 'seller', fields: [transactions.sellerId], references: [users.id] }) }));
export const conversationsRelations = relations(conversations, ({ one, many }) => ({ book: one(books, { fields: [conversations.bookId], references: [books.id] }), participantOne: one(users, { relationName: 'participantOne', fields: [conversations.participantOneId], references: [users.id] }), participantTwo: one(users, { relationName: 'participantTwo', fields: [conversations.participantTwoId], references: [users.id] }), messages: many(messages) }));
export const messagesRelations = relations(messages, ({ one }) => ({ conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }), sender: one(users, { fields: [messages.senderId], references: [users.id] }) }));

export type User = typeof users.$inferSelect;
export type Book = typeof books.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
