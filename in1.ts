/**
 * SENIOR TYPESCRIPT ENGINEER INTERVIEW CHALLENGE
 * 
 * Task: Build a type-safe Order Management System
 * 
 * Requirements:
 * 1. Implement proper TypeScript types (generics, unions, intersections, utility types)
 * 2. Handle complex data structures (Maps, Sets, Arrays)
 * 3. Demonstrate type guards and type narrowing
 * 4. Use advanced TypeScript features (conditional types, mapped types)
 * 5. Ensure type safety throughout
 */

// ============= PART 1: Type Definitions =============

// TODO: Define proper types for the following:

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  totalAmount: number;
}

// ============= PART 2: Advanced Type Challenges =============

/**
 * Challenge 1: Create a utility type that makes specific fields optional
 * Usage: PartialBy<Order, 'status' | 'totalAmount'>
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Challenge 2: Create a type for order updates (all fields optional except id)
 */
type OrderUpdate = PartialBy<Order, Exclude<keyof Order, 'id'>>;

/**
 * Challenge 3: Extract all valid status transitions as a type
 */
type StatusTransition = {
  from: OrderStatus;
  to: OrderStatus;
};

// ============= PART 3: Implementation =============

class OrderManagementSystem {
  private orders: Map<string, Order> = new Map();
  private customerOrders: Map<string, Set<string>> = new Map();
  
  // Valid status transitions
  private readonly validTransitions: Map<OrderStatus, Set<OrderStatus>> = new Map([
    ['pending', new Set(['processing', 'cancelled'])],
    ['processing', new Set(['shipped', 'cancelled'])],
    ['shipped', new Set(['delivered'])],
    ['delivered', new Set()],
    ['cancelled', new Set()]
  ]);

  /**
   * TODO: Implement this method
   * - Add order to orders Map
   * - Update customerOrders index
   * - Calculate totalAmount from items
   * - Validate data types and constraints
   */
  addOrder(order: Omit<Order, 'totalAmount'>): Order {
    // Calculate total amount from items
    const totalAmount = order.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create complete order
    const completeOrder: Order = {
      ...order,
      totalAmount
    };

    // Validate order doesn't already exist
    if (this.orders.has(order.id)) {
      throw new Error(`Order ${order.id} already exists`);
    }

    // Add to orders map
    this.orders.set(order.id, completeOrder);

    // Update customer orders index
    if (!this.customerOrders.has(order.customerId)) {
      this.customerOrders.set(order.customerId, new Set());
    }
    this.customerOrders.get(order.customerId)!.add(order.id);

    return completeOrder;
  }

  /**
   * TODO: Implement this method
   * - Use type guard to validate status transition
   * - Update order status only if transition is valid
   * - Return updated order or throw error
   */
  updateOrderStatus(orderId: string, newStatus: OrderStatus): Order {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Check if transition is valid
    const allowedTransitions = this.validTransitions.get(order.status);
    if (!allowedTransitions || !allowedTransitions.has(newStatus)) {
      throw new Error(
        `Invalid status transition from ${order.status} to ${newStatus}`
      );
    }

    // Update order status
    const updatedOrder: Order = {
      ...order,
      status: newStatus
    };

    this.orders.set(orderId, updatedOrder);
    
    return updatedOrder;
  }

  /**
   * TODO: Implement this method with proper type narrowing
   * - Filter orders by multiple criteria
   * - Use type predicates where appropriate
   */
  getOrders(filter?: {
    customerId?: string;
    status?: OrderStatus;
    minAmount?: number;
    category?: string;
  }): Order[] {
    let results = Array.from(this.orders.values());

    if (!filter) {
      return results;
    }

    // Filter by customer ID using index for efficiency
    if (filter.customerId) {
      const customerOrderIds = this.customerOrders.get(filter.customerId);
      if (!customerOrderIds) {
        return [];
      }
      results = results.filter(order => customerOrderIds.has(order.id));
    }

    // Filter by status
    if (filter.status) {
      results = results.filter(order => order.status === filter.status);
    }

    // Filter by minimum amount
    if (filter.minAmount !== undefined) {
      results = results.filter(order => order.totalAmount >= filter.minAmount!);
    }

    // Filter by category (checking if any item matches)
    if (filter.category) {
      results = results.filter(order => 
        order.items.some(item => item.product.category === filter.category)
      );
    }

    return results;
  }

  /**
   * TODO: Implement this method
   * - Calculate statistics grouped by status
   * - Return type-safe aggregated data
   */
  getOrderStatistics(): Record<OrderStatus, { count: number; totalRevenue: number }> {
    // Initialize all statuses with zero values
    const stats: Record<OrderStatus, { count: number; totalRevenue: number }> = {
      pending: { count: 0, totalRevenue: 0 },
      processing: { count: 0, totalRevenue: 0 },
      shipped: { count: 0, totalRevenue: 0 },
      delivered: { count: 0, totalRevenue: 0 },
      cancelled: { count: 0, totalRevenue: 0 }
    };

    // Aggregate data
    for (const order of this.orders.values()) {
      stats[order.status].count++;
      stats[order.status].totalRevenue += order.totalAmount;
    }

    return stats;
  }

  /**
   * TODO: Implement a generic method to group orders by any key
   * Example: groupBy('status') or groupBy('customerId')
   */
  groupBy<K extends keyof Order>(key: K): Map<Order[K], Order[]> {
    const grouped = new Map<Order[K], Order[]>();

    for (const order of this.orders.values()) {
      const keyValue = order[key];
      
      if (!grouped.has(keyValue)) {
        grouped.set(keyValue, []);
      }
      
      grouped.get(keyValue)!.push(order);
    }

    return grouped;
  }

  /**
   * BONUS: Implement type-safe event system
   * - Use discriminated unions for events
   * - Implement proper type narrowing in handlers
   */
  private eventHandlers: Map<string, Function[]> = new Map();

  addEventListener<T extends OrderEvent>(
    eventType: T['type'],
    handler: (event: T) => void
  ): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  private emitEvent<T extends OrderEvent>(event: T): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  // Enhanced addOrder with events
  addOrderWithEvents(order: Omit<Order, 'totalAmount'>): Order {
    const completeOrder = this.addOrder(order);
    this.emitEvent({ type: 'order.created', order: completeOrder });
    return completeOrder;
  }

  // Enhanced updateOrderStatus with events
  updateOrderStatusWithEvents(orderId: string, newStatus: OrderStatus): Order {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    
    const oldStatus = order.status;
    const updatedOrder = this.updateOrderStatus(orderId, newStatus);
    
    this.emitEvent({
      type: 'order.statusChanged',
      orderId,
      oldStatus,
      newStatus
    });
    
    return updatedOrder;
  }
}

// Event types for bonus challenge
type OrderEvent = 
  | { type: 'order.created'; order: Order }
  | { type: 'order.updated'; orderId: string; changes: Partial<Order> }
  | { type: 'order.statusChanged'; orderId: string; oldStatus: OrderStatus; newStatus: OrderStatus };

// ============= PART 4: Test Cases =============

// TODO: Implement test cases to verify your implementation

const testSystem = () => {
  const oms = new OrderManagementSystem();
  
  const testOrder: Omit<Order, 'totalAmount'> = {
    id: 'ORD-001',
    customerId: 'CUST-001',
    status: 'pending',
    createdAt: new Date(),
    items: [
      {
        product: { id: 'P1', name: 'Laptop', price: 1200, category: 'Electronics' },
        quantity: 1
      },
      {
        product: { id: 'P2', name: 'Mouse', price: 25, category: 'Electronics' },
        quantity: 2
      }
    ]
  };

  console.log('=== Test 1: Add Order ===');
  const order = oms.addOrder(testOrder);
  console.log('Total amount:', order.totalAmount); // Should be 1250
  console.log('Order added:', order.id);

  console.log('\n=== Test 2: Update Status (Valid) ===');
  try {
    const updated = oms.updateOrderStatus('ORD-001', 'processing');
    console.log('Status updated to:', updated.status);
  } catch (e) {
    console.error('Error:', (e as Error).message);
  }

  console.log('\n=== Test 3: Update Status (Invalid) ===');
  try {
    oms.updateOrderStatus('ORD-001', 'delivered'); // Should fail
  } catch (e) {
    console.error('Expected error:', (e as Error).message);
  }

  console.log('\n=== Test 4: Add More Orders ===');
  oms.addOrder({
    id: 'ORD-002',
    customerId: 'CUST-001',
    status: 'pending',
    createdAt: new Date(),
    items: [
      {
        product: { id: 'P3', name: 'Keyboard', price: 75, category: 'Electronics' },
        quantity: 1
      }
    ]
  });

  oms.addOrder({
    id: 'ORD-003',
    customerId: 'CUST-002',
    status: 'shipped',
    createdAt: new Date(),
    items: [
      {
        product: { id: 'P4', name: 'Desk', price: 300, category: 'Furniture' },
        quantity: 1
      }
    ]
  });

  console.log('\n=== Test 5: Filter by Customer ===');
  const customerOrders = oms.getOrders({ customerId: 'CUST-001' });
  console.log(`Customer CUST-001 has ${customerOrders.length} orders`);

  console.log('\n=== Test 6: Filter by Status ===');
  const pendingOrders = oms.getOrders({ status: 'pending' });
  console.log(`Pending orders: ${pendingOrders.length}`);

  console.log('\n=== Test 7: Filter by Category ===');
  const electronicsOrders = oms.getOrders({ category: 'Electronics' });
  console.log(`Electronics orders: ${electronicsOrders.length}`);

  console.log('\n=== Test 8: Get Statistics ===');
  const stats = oms.getOrderStatistics();
  console.log('Order statistics by status:');
  Object.entries(stats).forEach(([status, data]) => {
    if (data.count > 0) {
      console.log(`  ${status}: ${data.count} orders, ${data.totalRevenue} revenue`);
    }
  });

  console.log('\n=== Test 9: Group By Status ===');
  const groupedByStatus = oms.groupBy('status');
  console.log('Orders grouped by status:');
  groupedByStatus.forEach((orders, status) => {
    console.log(`  ${status}: ${orders.length} orders`);
  });

  console.log('\n=== Test 10: Event System (BONUS) ===');
  oms.addEventListener('order.created', (event) => {
    console.log(`Event: New order created - ${event.order.id}`);
  });

  oms.addEventListener('order.statusChanged', (event) => {
    console.log(`Event: Order ${event.orderId} status changed from ${event.oldStatus} to ${event.newStatus}`);
  });

  const newOrder = oms.addOrderWithEvents({
    id: 'ORD-004',
    customerId: 'CUST-003',
    status: 'pending',
    createdAt: new Date(),
    items: [
      {
        product: { id: 'P5', name: 'Monitor', price: 350, category: 'Electronics' },
        quantity: 2
      }
    ]
  });

  oms.updateOrderStatusWithEvents('ORD-004', 'processing');

  console.log('\n=== All Tests Completed ===');
};

// Uncomment to run tests
// testSystem();

/**
 * EVALUATION CRITERIA:
 * 
 * 1. Type Safety (30%):
 *    - Proper use of generics, unions, intersections
 *    - No 'any' types unless absolutely necessary
 *    - Correct utility type implementations
 * 
 * 2. Data Structure Handling (25%):
 *    - Efficient use of Map and Set
 *    - Proper indexing and lookup strategies
 *    - Memory-efficient implementations
 * 
 * 3. Type Guards & Narrowing (20%):
 *    - Proper type predicates
 *    - Runtime type checking where needed
 *    - Discriminated union handling
 * 
 * 4. Code Quality (15%):
 *    - Clean, readable code
 *    - Proper error handling
 *    - Edge case consideration
 * 
 * 5. Advanced Features (10%):
 *    - Generic constraints
 *    - Conditional types
 *    - Mapped types usage
 */