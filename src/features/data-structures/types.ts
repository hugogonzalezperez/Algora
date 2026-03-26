export type DataStructureType = 'STACK' | 'QUEUE' | 'LINKED_LIST' | 'TREE';

export const DATA_STRUCTURES: Record<DataStructureType, { name: string; id: DataStructureType }> = {
  STACK: { name: 'Stack', id: 'STACK' },
  QUEUE: { name: 'Queue', id: 'QUEUE' },
  LINKED_LIST: { name: 'Linked List', id: 'LINKED_LIST' },
  TREE: { name: 'Binary Search Tree', id: 'TREE' },
};
