export type DataStructureType = 'STACK' | 'QUEUE' | 'LINKED_LIST' | 'HASH_TABLE' | 'TREE';

export const DATA_STRUCTURES: Record<DataStructureType, { name: string; id: DataStructureType }> = {
  STACK: { name: 'Stack', id: 'STACK' },
  QUEUE: { name: 'Queue', id: 'QUEUE' },
  LINKED_LIST: { name: 'Linked List', id: 'LINKED_LIST' },
  HASH_TABLE: { name: 'Hash Table', id: 'HASH_TABLE' },
  TREE: { name: 'Binary Search Tree', id: 'TREE' },
};
