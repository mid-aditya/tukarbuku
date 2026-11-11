import { z } from 'zod';

/** Ajuan transaksi dari halaman chat (context: percakapan yang terikat buku). */
export const transactionProposalSchema = z.object({
  conversationId: z.string().uuid(),
});

/** Transisi status transaksi dari dashboard. */
export const transactionActionSchema = z.object({
  action: z.enum(['accept', 'decline', 'cancel', 'complete']),
});

export type TransactionAction = z.infer<typeof transactionActionSchema>['action'];

/** Label status untuk UI (DB enum transaction_status). */
export const transactionStatusLabels: Record<string, string> = {
  pending: 'Menunggu jawaban',
  disepakati: 'Disepakati',
  selesai: 'Selesai',
  batal: 'Dibatalkan',
};
