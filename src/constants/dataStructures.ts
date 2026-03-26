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
  LINKED_LIST: {
    id: 'LINKED_LIST',
    name: 'Linked List',
    description: 'A linked list is a linear data structure where elements are not stored at contiguous memory locations. Instead, each element (node) contains a data field and a reference (link) to the next node in the sequence.',
    timeComplexity: {
      access: 'O(n)',
      search: 'O(n)',
      insertion: 'O(1) - At Head/Tail',
      deletion: 'O(1) - At Head/Tail',
    },
    characteristics: [
      'Dynamic Size: Can grow or shrink during execution without reallocating the entire structure.',
      'Non-Contiguous: Nodes can be scattered in memory, connected via pointers.',
      'Sequential Access: To reach the n-th element, you must traverse all preceding nodes.',
      'Head and Tail: The list starts at the "Head" and ends at a "Tail" pointing to null.',
    ],
    applications: [
      'Implementation of Stacks and Queues.',
      'Adjacency List representation in Graphs.',
      'Undo functionality in applications.',
      'Dynamic memory allocation (Heap management).',
      'Music playlists or image galleries (prev/next navigation).',
    ],
    commonErrors: [
      { name: 'Null Pointer Exception', description: 'Attempting to access a property or value of a null node (beyond the tail).' },
      { name: 'Memory Leak', description: 'Losing the reference to the head or intermediate nodes, making parts of the list unreachable.' }
    ],
    pseudocode: `procedure APPEND(head, value):
  new_node = createNode(value)
  if head is null:
    return new_node
  
  temp = head
  while temp.next is not null:
    temp = temp.next
  
  temp.next = new_node
  return head

procedure DELETE(head, value):
  if head is null: return null
  if head.value == value: return head.next
  
  temp = head
  while temp.next is not null:
    if temp.next.value == value:
      temp.next = temp.next.next
      return head
    temp = temp.next
  return head`,
    pseudocodeLegend: {
      "head": "The first node in the list.",
      "temp": "A temporary pointer used for traversal.",
      "next": "The pointer field within a node that links to the next element."
    }
  },
  HASH_TABLE: {
    id: 'HASH_TABLE',
    name: 'Hash Table',
    description: 'A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.',
    timeComplexity: {
      access: 'N/A',
      search: 'O(1) Avg, O(n) Worst',
      insertion: 'O(1) Avg, O(n) Worst',
      deletion: 'O(1) Avg, O(n) Worst',
    },
    characteristics: [
      'Hash Function: Converts a key into a numerical index.',
      'Collision Resolution: Managing cases where different keys produce the same index (e.g., Chaining or Open Addressing).',
      'Fast Lookup: Provides $O(1)$ average time complexity for most operations.',
      'Load Factor: The ratio of elements to buckets; affects performance and triggers resizing.',
    ],
    applications: [
      'Database Indexing for fast record retrieval.',
      'Caching mechanisms (e.g., Memcached, Redis).',
      'Symbol tables in Compilers.',
      'Set implementations (Unique elements).',
      'Password storage (Hash-based security).',
    ],
    commonErrors: [
      { name: 'Hash Collision', description: 'Multiple keys mapping to the same index, which can degrade performance if not handled correctly.' },
      { name: 'Poor Hash Function', description: 'A function that distributes keys unevenly, leading to "clustering" and many collisions.' }
    ],
    pseudocode: `procedure INSERT(table, key, value):
  index = hash(key) mod capacity
  bucket = table[index]
  
  for each entry in bucket:
    if entry.key == key:
      entry.value = value
      return
  
  bucket.append({key, value})

procedure SEARCH(table, key):
  index = hash(key) mod capacity
  bucket = table[index]
  
  for each entry in bucket:
    if entry.key == key:
      return entry.value
  
  return null`,
    pseudocodeLegend: {
      "hash(key)": "Function that converts a key into a large integer.",
      "mod capacity": "Ensures the index fits within the internal array bounds.",
      "bucket": "A slot in the array, often containing a linked list for collision handling."
    }
  },
};
