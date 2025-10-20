import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Input,
  Switch,
  Text,
  Badge,
} from "@medusajs/ui";
import { XMark, CheckMini } from "@medusajs/icons";

// Define the interface for your data
interface Item {
  id: string;
  text: string;
  description: string;
  href: string;
  order: number;
  active: boolean;
  category: string;
}

// Mock data (replace with your actual database fetch)
const mockData: Item[] = [
  {
    id: "01K7QAX0SC5B7RDD3K0EZWQM16",
    text: "ERidePro - Free parts with purchase!",
    description: "Code: TONK",
    href: "https://eridepros.com",
    order: 1,
    active: true,
    category: "emoto",
  },
  {
    id: "01K7QAX0SC5B7RDD3K0EZWQM17",
    text: "TechGadgets - New arrivals!",
    description: "Save 10% on all electronics",
    href: "https://techgadgets.com",
    order: 2,
    active: true,
    category: "electronics",
  },
  {
    id: "01K7QAX0SC5B7RDD3K0EZWQM18",
    text: "Home Decor Co - Flash Sale!",
    description: "Up to 50% off",
    href: "https://homedecor.com",
    order: 3,
    active: false,
    category: "homegoods",
  },
];

const ItemEditor: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);

  // Simulate fetching data on component mount
  useEffect(() => {
    setItems(mockData);
  }, []);

  const handleEditClick = (item: Item) => {
    setEditingItemId(item.id);
    setEditedItem({ ...item }); // Create a shallow copy for editing
  };

  const handleSaveClick = (id: string) => {
    if (editedItem) {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? editedItem : item)),
      );
      setEditingItemId(null);
      setEditedItem(null);
      // In a real application, you'd send editedItem to your backend here
      console.log("Saved item:", editedItem);
    }
  };

  const handleCancelClick = () => {
    setEditingItemId(null);
    setEditedItem(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Item,
  ) => {
    if (editedItem) {
      let value: string | boolean | number = e.target.value;

      if (field === "active") {
        value = (e.target as HTMLInputElement).checked;
      } else if (field === "order") {
        value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
          value = 0; // Handle non-numeric input for order
        }
      }

      setEditedItem({
        ...editedItem,
        [field]: value,
      });
    }
  };

  const handleNumberInputChange = (value: string | number, field: "order") => {
    if (editedItem) {
      setEditedItem({
        ...editedItem,
        [field]: typeof value === "string" ? parseInt(value, 10) : value,
      });
    }
  };

  return (
    <Container className="p-4">
      <Text className="mb-4 text-xl font-semibold">Database Item Editor</Text>

      {items.length === 0 ? (
        <Text>No items to display.</Text>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Text</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Href</Table.HeaderCell>
              <Table.HeaderCell>Order</Table.HeaderCell>
              <Table.HeaderCell>Active</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell className="text-right">
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id} className="hover:bg-ui-bg-base-hover">
                {editingItemId === item.id && editedItem ? (
                  <>
                    <Table.Cell>
                      <Input
                        value={editedItem.text}
                        onChange={(e) => handleChange(e, "text")}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        value={editedItem.description}
                        onChange={(e) => handleChange(e, "description")}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        value={editedItem.href}
                        onChange={(e) => handleChange(e, "href")}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        value={editedItem.order}
                        onChange={(e) => handleChange(e, "order")}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Switch
                        checked={editedItem.active}
                        onCheckedChange={(checked) =>
                          setEditedItem({ ...editedItem, active: checked })
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        value={editedItem.category}
                        onChange={(e) => handleChange(e, "category")}
                      />
                    </Table.Cell>
                    <Table.Cell className="text-right flex gap-2">
                      <Button
                        variant="transparent"
                        onClick={() => handleSaveClick(item.id)}
                      >
                        <CheckMini />
                      </Button>
                      <Button
                        variant="transparent"
                        color="red"
                        onClick={handleCancelClick}
                      >
                        <XMark />
                      </Button>
                    </Table.Cell>
                  </>
                ) : (
                  <>
                    <Table.Cell>{item.text}</Table.Cell>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell>{item.href}</Table.Cell>
                    <Table.Cell>{item.order}</Table.Cell>
                    <Table.Cell>
                      <Badge color={item.active ? "green" : "red"}>
                        {item.active ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{item.category}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Button
                        variant="transparent"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                  </>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  );
};

export default ItemEditor;
