export const DATA_STRUCTURES = {
  STACK: 'stack',
  QUEUE: 'queue',
};

export const DATA_STRUCTURE_METADATA = {
  STACK: {
    id: 'STACK',
    name: 'The Stack (LIFO)',
    description: 'A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. In a stack, all insertion and deletion operations are performed at one end, commonly referred to as the \'Top\'. It is similar to a stack of physical objects where you only interact with the top-most item.',
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1) - Push',
      deletion: 'O(1) - Pop',
    },
    characteristics: [
      'LIFO Logic: Last In, First Out. The most recently added element is the first one to be removed.',
      'Single Access Point: Only the "Top" of the stack is accessible for adding or removing elements.',
      'Contiguous Storage: Often implemented using arrays or linked lists with a single pointer.',
      'Restricted Growth: Elements are always added "on top" of previous elements.',
    ],
    applications: [
      'Function Calls: The "Call Stack" manages local variables and return addresses during execution.',
      'Undo/Redo: software history is often stored in a stack (LIFO).',
      'Expression Parsing: Used for converting and evaluating infix, prefix, and postfix notations.',
      'Backtracking: Maintaining state in DFS or maze-solving algorithms.',
      'String Reversal: Pushing characters and then popping them results in a reversed string.',
    ],
    commonErrors: [
      { name: 'Stack Overflow', description: 'Attempting to push an element onto a stack that has already reached its maximum capacity.' },
      { name: 'Stack Underflow', description: 'Attempting to pop or peek an element from an empty stack.' }
    ],
    pseudocode: `procedure PUSH(stack, value):
  if stack is full:
    return "Overflow Error"
  
  top = top + 1
  stack[top] = value
  return success

procedure POP(stack):
  if stack is empty:
    return "Underflow Error"
  
  value = stack[top]
  top = top - 1
  return value`,
    pseudocodeLegend: {
      "top": "The index or pointer to the top-most element in the stack.",
      "capacity": "Total number of elements the stack can hold.",
      "stack": "The underlying array or storage structure."
    }
  },
  QUEUE: {
    id: 'QUEUE',
    name: 'The Queue (FIFO)',
    description: 'A queue is a linear data structure that follows the First In, First Out (FIFO) principle. Elements are added at the rear (enqueue) and removed from the front (dequeue). It mimics real-world scenarios like waiting lines or task buffers.',
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1) - Enqueue',
      deletion: 'O(1) - Dequeue',
    },
    characteristics: [
      'FIFO Logic: The first element added will be the first one removed ("First come, first served").',
      'Two Ends: Operations happen at two distinct specialized ends: Front (for deletion) and Rear (for insertion).',
      'Non-Primitive: It is an Abstract Data Type (ADT) that can be implemented using arrays or linked lists.',
      'Ordering: maintains the order in which elements were added.',
    ],
    applications: [
      'Task Scheduling: Operating system scheduling (e.g., FCFS, Round Robin).',
      'Data Buffers: Handling asynchronous data flow (e.g., IO buffers, keyboard typing, video streaming).',
      'Graph Algorithms: Breadth-First Search (BFS) relies on a queue to explore nodes level by level.',
      'Print Spooling: documents sent to a printer are queued for sequential processing.',
    ],
    commonErrors: [
      { name: 'Queue Overflow', description: 'Attempting to enqueue an element into a fixed-size queue that is already full.' },
      { name: 'Queue Underflow', description: 'Attempting to dequeue or peek from an empty queue.' }
    ],
    pseudocode: `procedure ENQUEUE(queue, value):
  if queue is full:
    return "Overflow Error"
  
  rear = (rear + 1) mod capacity
  queue[rear] = value
  return success

procedure DEQUEUE(queue):
  if queue is empty:
    return "Underflow Error"
  
  value = queue[front]
  front = (front + 1) mod capacity
  return value`,
    pseudocodeLegend: {
      "front": "Pointer to the first element in the queue.",
      "rear": "Pointer to the last element in the queue.",
      "capacity": "The maximum number of elements the queue can hold.",
      "mod": "Modulo operator, often used in Circular Queue implementations to wrap indices."
    }
  },
};
