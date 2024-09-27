class Node<T> {
  data: T;
  next: Node<T> | null;
  pre: Node<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
    this.pre = null;
  }
}

class LinkedList<T> {
  head: Node<T> | null;
  current: Node<T> | null;

  constructor() {
    this.head = null;
    this.current = null;
  }

  insert(data: T) {
    const newNode = new Node(data);
    if (this.head === null) {
      this.head = newNode;
      this.current = newNode;
    } else {
      let temp = this.head;
      while (temp.next !== null) {
        temp = temp.next;
      }
      temp.next = newNode;
      newNode.pre = temp;
      this.current = newNode;
    }
  }

  undoEdit = (): T | null => {
    const preData = this.current?.pre;
    if (preData) {
      this.current = preData;
      return preData.data;
    } else {
      return null;
    }
  };

  redoEdit = (): T | null => {
    const nextData = this.current?.next;
    if (nextData) {
      this.current = nextData;
      return nextData.data;
    } else {
      return null;
    }
  };

  reset() {
    this.head = null;
    this.current = null;
  }
}

const storeData: Record<number, LinkedList<any>> = {}; // Store linked lists for each image index

export const getLinkedListForImage = (imageIndex: number): LinkedList<any> => {
  if (!storeData[imageIndex]) {
    storeData[imageIndex] = new LinkedList<any>();
  }
  return storeData[imageIndex];
};

export default storeData;
