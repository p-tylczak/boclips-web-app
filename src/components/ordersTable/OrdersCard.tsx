import {
  Order,
  OrderStatus,
} from 'boclips-api-client/dist/sub-clients/orders/model/Order';
import React, { ReactElement } from 'react';
import dateFormat from 'dateformat';
import { Link } from 'react-router-dom';
import { orderDeliveryStatus } from 'src/components/ordersTable/OrderDeliveryStatus';

interface Props {
  order: Order;
}

interface ItemProps {
  header: string;
  value: ReactElement;
}

const Item = ({ header, value }: ItemProps) => {
  return (
    <div className="flex flex-col text-xs my-8">
      <div className="text-sm text-grey-700 font-medium">{header}</div>
      {value}
    </div>
  );
};

export const OrdersCard = ({ order }: Props) => {
  const getDeliveryStatusLabel = (status: OrderStatus): ReactElement | null => {
    const deliveryStatus = orderDeliveryStatus.get(status);

    if (deliveryStatus === undefined) {
      return null;
    }
    return (
      <div
        className={`${
          deliveryStatus === 'PROCESSING' ? 'text-blue-700' : 'text-gray-800'
        } text-sm font-medium`}
      >
        {deliveryStatus}
      </div>
    );
  };

  return (
    <div className="col-start-2 col-end-26 flex flex-row border-b-2 text-grey-700 justify-between">
      <Item
        header="Order date"
        value={
          <div className="text-gray-800 text-sm">
            {dateFormat(order.createdAt, 'dd/mm/yy')}
          </div>
        }
      />
      <Item
        header="Order number"
        value={
          <Link data-qa="order-id" to={`/orders/${order.id}`}>
            <div className="text-blue-800 text-sm underline">{order.id}</div>
          </Link>
        }
      />
      <Item header="Status" value={getDeliveryStatusLabel(order.status)} />
      <Item
        header="Delivery date"
        value={
          <div className="text-gray-800 text-sm" data-qa="delivery-date">
            {order.deliveryDate
              ? dateFormat(order.deliveryDate, 'dd/mm/yy')
              : '-'}
          </div>
        }
      />
    </div>
  );
};