export const DATA_STRUCTURES = {
  STACK: 'stack',
  QUEUE: 'queue',
};

export const DATA_STRUCTURE_METADATA = {
  STACK: {
    id: 'STACK',
    name: 'The Stack (LIFO)',
    description: 'A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. In a stack, all insertion and deletion operations are performed at one end, commonly referred to as the \'Top\'.',
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)',
    },
    characteristics: [
      'LIFO Logic: The last element added to the stack will be the first one to be removed, mimicking a physical stack of paper or plates.',
      'Memory Access: elements are typically stored in a contiguous block of memory, allowing for predictable pointer arithmetic.',
    ],
    applications: [
      'Function Calls (Call Stack) for managing local variables and return addresses.',
      'Undo/Redo mechanisms in software applications.',
      'Expression parsing and evaluation (Infix to Postfix conversion).',
      'Backtracking algorithms like Depth First Search (DFS).',
    ],
    commonErrors: [
      { name: 'Stack Overflow', description: 'Attempting to push an element onto a stack that has already reached its maximum capacity. This leads to a memory fault.' },
      { name: 'Stack Underflow', description: 'Attempting to pop or peek an element from an empty stack, meaning there is no data left to retrieve.' }
    ],
  },
  QUEUE: {
    id: 'QUEUE',
    name: 'The Queue (FIFO)',
    description: 'A queue is a linear data structure that follows the First In, First Out (FIFO) principle. Elements are added at the rear (enqueue) and removed from the front (dequeue).',
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)',
    },
    characteristics: [
      'FIFO Logic: The first element added will be the first one removed, similar to a line of people waiting for service.',
      'Two Ends: Operations happen at two distinct ends (Front and Rear).',
    ],
    applications: [
      'Task Scheduling in Operating Systems.',
      'Handling asynchronous data (IO Buffers).',
      'Breadth First Search (BFS) in graphs.',
      'Print spooling.',
    ],
    commonErrors: [
      { name: 'Queue Overflow', description: 'Attempting to enqueue an element into a queue that has already reached its maximum capacity.' },
      { name: 'Queue Underflow', description: 'Attempting to dequeue an element from an empty queue.' }
    ],
  },
};
