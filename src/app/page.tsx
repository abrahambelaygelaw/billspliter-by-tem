"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2Icon, PlusIcon, DollarSignIcon } from "lucide-react";

const page = () => {
  const [friends, setFriends] = useState([]);
  const [serviceChargeEnabled, setServiceChargeEnabled] = useState(false);
  const [serviceChargePercent, setServiceChargePercent] = useState(10);
  const [newItemInputs, setNewItemInputs] = useState({});

  // Helper functions remain the same
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addFriend = () => {
    const newFriend = {
      id: generateId(),
      name: `Friend ${friends.length + 1}`,
      items: [],
      vatExclusive: false,
    };
    setFriends([...friends, newFriend]);
  };

  const removeFriend = (friendId) => {
    setFriends(friends.filter((friend) => friend.id !== friendId));
  };

  const updateFriendName = (friendId, newName) => {
    setFriends(
      friends.map((friend) =>
        friend.id === friendId ? { ...friend, name: newName } : friend
      )
    );
  };

  const toggleVatExclusive = (friendId) => {
    setFriends(
      friends.map((friend) =>
        friend.id === friendId
          ? { ...friend, vatExclusive: !friend.vatExclusive }
          : friend
      )
    );
  };

  const addItem = (friendId) => {
    const price = parseFloat(newItemInputs[friendId]);
    if (!price || isNaN(price)) return;

    setFriends(
      friends.map((friend) => {
        if (friend.id === friendId) {
          return {
            ...friend,
            items: [...friend.items, { id: generateId(), price }],
          };
        }
        return friend;
      })
    );
    setNewItemInputs((prev) => ({ ...prev, [friendId]: "" }));
  };

  const removeItem = (friendId, itemId) => {
    setFriends(
      friends.map((friend) => {
        if (friend.id === friendId) {
          return {
            ...friend,
            items: friend.items.filter((item) => item.id !== itemId),
          };
        }
        return friend;
      })
    );
  };

  const calculateFriendTotal = (friend) => {
    const subtotal = friend.items.reduce((sum, item) => sum + item.price, 0);
    const vat = friend.vatExclusive ? subtotal * 0.15 : 0;
    const serviceCharge = serviceChargeEnabled
      ? subtotal * (serviceChargePercent / 100)
      : 0;
    const total = subtotal + vat + serviceCharge;
    return { subtotal, vat, serviceCharge, total };
  };

  const calculateBillTotals = () => {
    return friends.reduce(
      (totals, friend) => {
        const friendTotals = calculateFriendTotal(friend);
        return {
          subtotal: totals.subtotal + friendTotals.subtotal,
          vat: totals.vat + friendTotals.vat,
          serviceCharge: totals.serviceCharge + friendTotals.serviceCharge,
          total: totals.total + friendTotals.total,
        };
      },
      { subtotal: 0, vat: 0, serviceCharge: 0, total: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111111] to-[#1a1a1a] p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-lg border-[#ffc000]/20 shadow-xl">
        <CardHeader className="pb-8">
          <CardTitle className="text-[#ffc000] text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-2">
            <DollarSignIcon className="w-6 h-6 md:w-8 md:h-8" />
            Bill Splitter
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Service Charge Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-[#1a1a1a]/50 rounded-lg border border-[#ffc000]/20 backdrop-blur-sm transition-all duration-200 hover:bg-[#1a1a1a]/60">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <Switch
                  checked={serviceChargeEnabled}
                  onCheckedChange={setServiceChargeEnabled}
                  id="service-charge-toggle"
                  className="data-[state=checked]:bg-[#ffc000] data-[state=checked]:text-black"
                />
                <label
                  htmlFor="service-charge-toggle"
                  className="text-[#ffc000] font-medium"
                >
                  Service Charge
                </label>
              </div>
              {serviceChargeEnabled && (
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={serviceChargePercent}
                    onChange={(e) =>
                      setServiceChargePercent(Number(e.target.value))
                    }
                    className="w-20 bg-[#222222] border-[#ffc000]/20 text-[#ffc000] focus:border-[#ffc000] transition-colors"
                  />
                  <span className="text-[#ffc000]">%</span>
                </div>
              )}
            </div>
          </div>

          {/* Friends List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-[#ffc000]/20">
              <h2 className="text-[#ffc000] text-lg md:text-xl font-semibold">
                Friends
              </h2>
              <Button
                onClick={addFriend}
                className="bg-[#ffc000] text-black hover:bg-[#ffc000]/90 transition-colors duration-200"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Friend
              </Button>
            </div>

            <div className="grid gap-6">
              {friends.map((friend) => (
                <Card
                  key={friend.id}
                  className="p-4 md:p-6 bg-[#1a1a1a]/50 border-[#ffc000]/20 backdrop-blur-sm transition-all duration-200 hover:bg-[#1a1a1a]/60"
                >
                  <div className="space-y-6">
                    {/* Friend Header */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <Input
                        value={friend.name}
                        onChange={(e) =>
                          updateFriendName(friend.id, e.target.value)
                        }
                        className="w-full md:w-48 bg-[#222222] border-[#ffc000]/20 text-[#ffc000] focus:border-[#ffc000] transition-colors"
                      />
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={friend.vatExclusive}
                            onCheckedChange={() =>
                              toggleVatExclusive(friend.id)
                            }
                            id={`vat-toggle-${friend.id}`}
                            className="data-[state=checked]:bg-[#ffc000] data-[state=checked]:text-black"
                          />
                          <label
                            htmlFor={`vat-toggle-${friend.id}`}
                            className="text-[#ffc000]"
                          >
                            VAT Exclusive
                          </label>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => removeFriend(friend.id)}
                          className="text-[#ffc000] hover:text-[#ffc000]/80 hover:bg-[#ffc000]/10 transition-colors"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4">
                      {friend.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 text-[#ffc000] bg-[#222222]/30 p-2 rounded-lg"
                        >
                          <span className="w-24">${item.price.toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(friend.id, item.id)}
                            className="text-[#ffc000] hover:text-[#ffc000]/80 hover:bg-[#ffc000]/10 transition-colors ml-auto"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {/* Add New Item */}
                      <div className="flex items-center gap-3 pt-4 border-t border-[#ffc000]/20">
                        <Input
                          type="number"
                          value={newItemInputs[friend.id] || ""}
                          onChange={(e) =>
                            setNewItemInputs((prev) => ({
                              ...prev,
                              [friend.id]: e.target.value,
                            }))
                          }
                          placeholder="Item price"
                          className="w-full md:w-32 bg-[#222222] border-[#ffc000]/20 text-[#ffc000] focus:border-[#ffc000] placeholder:text-[#ffc000]/50 transition-colors"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addItem(friend.id);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addItem(friend.id)}
                          className="bg-[#ffc000] text-black hover:bg-[#ffc000]/90 transition-colors duration-200"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </div>

                    {/* Friend Total */}
                    {friend.items.length > 0 && (
                      <div className="pt-4 border-t border-[#ffc000]/20">
                        <div className="space-y-2 text-[#ffc000]">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>
                              $
                              {calculateFriendTotal(friend).subtotal.toFixed(2)}
                            </span>
                          </div>
                          {friend.vatExclusive && (
                            <div className="flex justify-between text-sm">
                              <span>VAT (15%):</span>
                              <span>
                                ${calculateFriendTotal(friend).vat.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {serviceChargeEnabled && (
                            <div className="flex justify-between text-sm">
                              <span>Service ({serviceChargePercent}%):</span>
                              <span>
                                $
                                {calculateFriendTotal(
                                  friend
                                ).serviceCharge.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium pt-2 border-t border-[#ffc000]/20">
                            <span>Total:</span>
                            <span>
                              ${calculateFriendTotal(friend).total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Bill Summary */}
        {friends.length > 0 && (
          <CardFooter className="pt-8 border-t border-[#ffc000]/20">
            <div className="w-full space-y-4">
              <h3 className="text-[#ffc000] text-xl font-semibold">
                Bill Summary
              </h3>
              <Card className="w-full bg-[#1a1a1a]/50 border-[#ffc000]/20 p-4 backdrop-blur-sm">
                <div className="space-y-2 text-[#ffc000]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateBillTotals().subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total VAT:</span>
                    <span>${calculateBillTotals().vat.toFixed(2)}</span>
                  </div>
                  {serviceChargeEnabled && (
                    <div className="flex justify-between">
                      <span>Total Service Charge:</span>
                      <span>
                        ${calculateBillTotals().serviceCharge.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg md:text-xl font-semibold pt-4 border-t border-[#ffc000]/20">
                    <span>Final Total:</span>
                    <span>${calculateBillTotals().total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default page;
