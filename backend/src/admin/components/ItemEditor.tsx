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
import { XMark, CheckMini, Plus, Spinner } from "@medusajs/icons"; // Added Plus icon
import { sdk } from "../../lib/sdk.js";
import { UpdateLinkrowWorkflowInput } from "../../workflows/update-linkrow.js";

type Item = UpdateLinkrowWorkflowInput;

const ItemEditor: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [creatingNewItem, setCreatingNewItem] = useState<boolean>(false); // New state for creating new item
  const [newItem, setNewItem] = useState<Omit<Item, "id"> | null>(null); // New item state

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await sdk.client.fetch("/linktree/linkrow");
      setItems(data.linkrows);
    } catch (err) {
      alert("Fetching linkrows from /linktree/linkrow failed.");
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItemId(item.id);
    setEditedItem({ ...item }); // Create a shallow copy for editing
    setCreatingNewItem(false); // Close new item form if open
  };

  const handleSaveClick = async (id: string) => {
    if (editedItem) {
      setSaving(true);
      try {
        await sdk.client.fetch(`/linktree/update`, {
          method: "POST",
          body: editedItem,
        });
        await fetchItems(); // Re-fetch items to get the latest data
        setSaving(false);
        setEditingItemId(null);
        setEditedItem(null);
      } catch (err) {
        setSaving(false);
        alert(
          "The API call to /linktree/update failed. Refresh the page to check for inconsistencies.",
        );
        setEditingItemId(null);
        setEditedItem(null);
      }
    }
  };

  const handleCancelClick = () => {
    setEditingItemId(null);
    setEditedItem(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Item,
    isNewItem: boolean = false,
  ) => {
    const targetItem = isNewItem ? newItem : editedItem;
    const setTargetItem = isNewItem ? setNewItem : setEditedItem;

    if (targetItem) {
      let value: string | boolean | number = e.target.value;

      if (field === "active") {
        value = (e.target as HTMLInputElement).checked;
      } else if (field === "order") {
        value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
          value = 0; // Handle non-numeric input for order
        }
      }

      setTargetItem({
        ...targetItem,
        [field]: value,
      });
    }
  };

  // --- New Item Creation Handlers ---
  const handleCreateNewClick = () => {
    setCreatingNewItem(true);
    setEditingItemId(null); // Close editing form if open
    setNewItem({
      text: "",
      description: "",
      href: "",
      order: 0,
      active: true,
      category: "",
    });
  };

  const handleSaveNewClick = async () => {
    if (newItem) {
      setSaving(true);
      try {
        await sdk.client.fetch("/linktree/linkrow", {
          method: "POST",
          body: newItem,
        });
        await fetchItems(); // Re-fetch items to include the new one
        setSaving(false);
        setCreatingNewItem(false);
        setNewItem(null);
      } catch (err) {
        setSaving(false);
        alert(
          "The API call to create a new linkrow failed. Refresh the page to check for inconsistencies.",
        );
        setCreatingNewItem(false);
        setNewItem(null);
      }
    }
  };

  const handleCancelNewClick = () => {
    setCreatingNewItem(false);
    setNewItem(null);
  };
  // --- End New Item Creation Handlers ---

  return (
    <Container className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <Text className="text-xl font-semibold">Linktree Links Editor</Text>
        <Button onClick={handleCreateNewClick} variant="primary">
          <Plus />
          Create New
        </Button>
      </div>

      {creatingNewItem && newItem && (
        <div className="mb-6 rounded-lg border border-ui-border-base p-4">
          <Text className="mb-3 text-lg font-medium">Create New Linkrow</Text>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Input
              placeholder="Text"
              value={newItem.text}
              onChange={(e) => handleChange(e, "text", true)}
            />
            <Input
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => handleChange(e, "description", true)}
            />
            <Input
              placeholder="Href"
              value={newItem.href}
              onChange={(e) => handleChange(e, "href", true)}
            />
            <Input
              type="number"
              placeholder="Order"
              value={newItem.order}
              onChange={(e) => handleChange(e, "order", true)}
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={newItem.active}
                onCheckedChange={(checked) =>
                  setNewItem({ ...newItem, active: checked })
                }
                id="new-item-active"
              />
              <label htmlFor="new-item-active">Active</label>
            </div>
            <Input
              placeholder="Category"
              value={newItem.category}
              onChange={(e) => handleChange(e, "category", true)}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCancelNewClick}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNewClick} disabled={saving}>
              {saving ? <Spinner /> : <CheckMini />}
              Save New Link
            </Button>
          </div>
        </div>
      )}

      {items.length === 0 && !creatingNewItem ? (
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
                    <Table.Cell className="flex justify-end gap-2">
                      <Button
                        variant="transparent"
                        onClick={() => handleSaveClick(item.id)}
                        disabled={saving}
                      >
                        {saving ? <Spinner /> : <CheckMini />}
                      </Button>
                      <Button
                        variant="transparent"
                        color="red"
                        onClick={handleCancelClick}
                        disabled={saving}
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
