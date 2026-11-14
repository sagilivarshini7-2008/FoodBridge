import { useEffect, useState } from "react";

const getFutureDate = (hours) => {
  const date = new Date(Date.now() + hours * 60 * 60 * 1000);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 16);
};

const initialFoods = [
  {
    id: 1,
    name: "Fresh Vegetable Meals",
    category: "Cooked Meals",
    quantity: 25,
    location: "Madhapur, Hyderabad",
    donor: "Green Leaf Restaurant",
    deadline: getFutureDate(5),
    condition: "Freshly prepared",
    storage: "Temperature controlled",
    description: "Freshly prepared meals available for immediate collection.",
    status: "Available",
    requestedBy: "",
  },
  {
    id: 2,
    name: "Fresh Bakery Items",
    category: "Bakery",
    quantity: 40,
    location: "Gachibowli, Hyderabad",
    donor: "City Bakery",
    deadline: getFutureDate(8),
    condition: "Fresh",
    storage: "Room temperature",
    description: "Surplus bread and bakery items ready for distribution.",
    status: "Available",
    requestedBy: "",
  },
  {
    id: 3,
    name: "Fresh Fruit Boxes",
    category: "Fruits",
    quantity: 20,
    location: "Kondapur, Hyderabad",
    donor: "Nature Basket",
    deadline: getFutureDate(12),
    condition: "Fresh",
    storage: "Refrigerated",
    description: "Fresh seasonal fruit boxes available for NGOs.",
    status: "Available",
    requestedBy: "",
  },
];

const foodIcons = {
  "Cooked Meals": "🍱",
  Bakery: "🥐",
  Fruits: "🍎",
  Vegetables: "🥦",
  "Packaged Food": "🥫",
};

const formatDeadline = (deadline) => {
  if (!deadline) return "Not specified";

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

function FoodCard({ food, role, user, onUpdate, onDelete }) {
  const isOwner = food.donor === user;
  const isRequestedByMe = food.requestedBy === user;

  const hoursLeft = food.deadline
    ? (new Date(food.deadline).getTime() - Date.now()) / 3600000
    : 100;

  let urgency = "Plenty of time";
  let urgencyColor = "bg-green-100 text-green-700";

  if (hoursLeft <= 0) {
    urgency = "Deadline passed";
    urgencyColor = "bg-red-100 text-red-700";
  } else if (hoursLeft <= 3) {
    urgency = "Urgent rescue";
    urgencyColor = "bg-red-100 text-red-700";
  } else if (hoursLeft <= 8) {
    urgency = "Rescue soon";
    urgencyColor = "bg-amber-100 text-amber-700";
  }

  const statusColor = {
    Available: "bg-green-100 text-green-700",
    Requested: "bg-amber-100 text-amber-700",
    Accepted: "bg-blue-100 text-blue-700",
    Collected: "bg-gray-100 text-gray-700",
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#f1f5e9] flex items-center justify-center text-3xl">
            {foodIcons[food.category] || "🍽️"}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[food.status] || "bg-gray-100 text-gray-700"}`}>
              {food.status}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${urgencyColor}`}>
              {urgency}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mt-4">
          {food.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {food.category}
        </p>

        <p className="text-sm text-gray-600 mt-3">
          {food.description || "Food available for community redistribution."}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-[#f7f8f3] p-3 rounded-xl">
            <p className="text-xs text-gray-500">Quantity</p>
            <p className="font-bold text-gray-900 mt-1">
              {food.quantity} servings
            </p>
          </div>

          <div className="bg-[#f7f8f3] p-3 rounded-xl">
            <p className="text-xs text-gray-500">Food condition</p>
            <p className="font-semibold text-sm text-gray-900 mt-1">
              {food.condition || "Not specified"}
            </p>
          </div>

          <div className="bg-[#f7f8f3] p-3 rounded-xl">
            <p className="text-xs text-gray-500">Storage</p>
            <p className="font-semibold text-sm text-gray-900 mt-1">
              {food.storage || "Not specified"}
            </p>
          </div>

          <div className="bg-[#f7f8f3] p-3 rounded-xl">
            <p className="text-xs text-gray-500">Collection deadline</p>
            <p className="font-semibold text-sm text-gray-900 mt-1">
              {formatDeadline(food.deadline)}
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 space-y-2">
          <p>📍 {food.location}</p>
          <p>🏪 Donor: {food.donor}</p>

          {food.requestedBy && (
            <p>🤝 Requested by: {food.requestedBy}</p>
          )}
        </div>

        <div className="mt-5">
          {role === "NGO-Receiver" &&
            food.status === "Available" &&
            !isOwner && (
              <button
                onClick={() =>
                  onUpdate(food.id, {
                    status: "Requested",
                    requestedBy: user,
                  })
                }
                className="w-full bg-[#183d2b] text-white py-3 rounded-xl font-semibold hover:bg-[#28563b]"
              >
                Request Food
              </button>
            )}

          {role === "Donor" &&
            isOwner &&
            food.status === "Requested" && (
              <button
                onClick={() =>
                  onUpdate(food.id, { status: "Accepted" })
                }
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                Accept Request
              </button>
            )}

          {role === "Donor" &&
            isOwner &&
            food.status === "Accepted" && (
              <button
                onClick={() =>
                  onUpdate(food.id, { status: "Collected" })
                }
                className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold"
              >
                Confirm Collection
              </button>
            )}

          {role === "NGO-Receiver" &&
            isRequestedByMe &&
            food.status === "Requested" && (
              <p className="text-center text-sm font-semibold text-amber-700 bg-amber-50 p-3 rounded-xl">
                Your request is waiting for donor approval.
              </p>
            )}

          {role === "Donor" &&
            isOwner &&
            food.status === "Available" && (
              <button
                onClick={() => onDelete(food.id)}
                className="w-full border border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50"
              >
                Remove Donation
              </button>
            )}

          {food.status === "Collected" && (
            <p className="text-center text-sm font-semibold text-green-700 bg-green-50 p-3 rounded-xl">
              ✓ Food successfully collected
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function App() {
  const [foods, setFoods] = useState(() => {
    try {
      const saved = localStorage.getItem("foodbridge-foods");
      return saved ? JSON.parse(saved) : initialFoods;
    } catch {
      return initialFoods;
    }
  });

  const [role, setRole] = useState("Donor");
  const [page, setPage] = useState("overview");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const user =
    role === "Donor" ? "Green Leaf Kitchen" : "Community NGO";

  const emptyForm = {
    name: "",
    category: "Cooked Meals",
    quantity: "",
    location: "",
    deadline: getFutureDate(5),
    condition: "Fresh",
    storage: "Room temperature",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem("foodbridge-foods", JSON.stringify(foods));
  }, [foods]);

  const availableFoods = foods.filter(
    (food) => food.status === "Available"
  );

  const totalQuantity = foods.reduce(
    (total, food) => total + Number(food.quantity || 0),
    0
  );

  const collectedFoods = foods.filter(
    (food) => food.status === "Collected"
  );

  const rescuedQuantity = collectedFoods.reduce(
    (total, food) => total + Number(food.quantity || 0),
    0
  );

  const requestedFoods = foods.filter(
    (food) => food.status === "Requested"
  );

  const filtered = foods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(search.toLowerCase()) ||
      food.location.toLowerCase().includes(search.toLowerCase()) ||
      food.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || food.category === category;

    return (
      food.status === "Available" &&
      matchesSearch &&
      matchesCategory
    );
  });

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addDonation = (e) => {
    e.preventDefault();

    const newFood = {
      ...form,
      id: Date.now(),
      quantity: Number(form.quantity),
      donor: user,
      status: "Available",
      requestedBy: "",
    };

    setFoods((previous) => [newFood, ...previous]);
    setForm(emptyForm);
    setShowForm(false);
    setPage("market");
  };

  const updateFood = (id, changes) => {
    setFoods((previous) =>
      previous.map((food) =>
        food.id === id ? { ...food, ...changes } : food
      )
    );
  };

  const deleteFood = (id) => {
    setFoods((previous) =>
      previous.filter((food) => food.id !== id)
    );
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "⌂" },
    { id: "market", label: "Rescue Market", icon: "♧" },
    { id: "operations", label: "My Operations", icon: "▤" },
    { id: "impact", label: "Impact Report", icon: "↗" },
  ];

  const myFoods = foods.filter((food) =>
    role === "Donor"
      ? food.donor === user
      : food.requestedBy === user
  );

  return (
    <div className="min-h-screen bg-[#f5f6f0] md:flex">
      <aside className="hidden md:flex w-64 bg-[#183d2b] text-white flex-col min-h-screen p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 bg-[#d6ef8b] rounded-xl flex items-center justify-center text-2xl">
            🌱
          </div>
          <div>
            <h1 className="text-xl font-extrabold">FoodBridge</h1>
            <p className="text-xs text-green-200">Rescue Intelligence</p>
          </div>
        </div>

        <p className="text-xs uppercase tracking-widest text-green-300 mb-4">
          Workspace
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition ${
                page === item.id
                  ? "bg-[#d6ef8b] text-[#183d2b] font-bold"
                  : "text-green-100 hover:bg-white/10"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-white/10 rounded-2xl p-4">
          <p className="font-semibold text-sm">Every meal matters.</p>
          <p className="text-xs text-green-200 mt-2">
            Connect surplus food with communities that need it.
          </p>
          <div className="text-4xl mt-4">🍃</div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-100 px-5 md:px-9 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">FOODBRIDGE PLATFORM</p>
            <h2 className="text-lg font-bold text-[#183d2b]">
              {menuItems.find((item) => item.id === page)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white"
            >
              <option>Donor</option>
              <option>NGO-Receiver</option>
            </select>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800">{user}</p>
              <p className="text-xs text-gray-500">{role} account</p>
            </div>

            <div className="w-10 h-10 bg-[#e6edda] rounded-full flex items-center justify-center">
              {role === "Donor" ? "🏪" : "🤝"}
            </div>
          </div>
        </header>

        <div className="md:hidden flex overflow-x-auto gap-2 p-3 bg-white border-b">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm ${
                page === item.id
                  ? "bg-[#183d2b] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-5 md:p-9 max-w-7xl mx-auto">

          {page === "overview" && (
            <section>
              <div className="grid lg:grid-cols-5 gap-5 mb-8">
                <div className="lg:col-span-3 bg-[#183d2b] text-white rounded-3xl p-7 md:p-9 relative overflow-hidden">
                  <div className="relative z-10 max-w-lg">
                    <span className="inline-block bg-white/15 text-green-100 px-3 py-1 rounded-full text-xs font-semibold">
                      THE SMART FOOD RESCUE NETWORK
                    </span>

                    <h2 className="text-3xl md:text-4xl font-extrabold mt-6 leading-tight">
                      Good food deserves
                      <span className="text-[#d6ef8b]"> a second chance.</span>
                    </h2>

                    <p className="text-green-100 mt-4 leading-relaxed">
                      Turn surplus food into meaningful support.
                      Connect food donors with NGOs and help reduce
                      food waste through smarter redistribution.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-7">
                      <button
                        onClick={() =>
                          role === "Donor"
                            ? setShowForm(true)
                            : setPage("market")
                        }
                        className="bg-[#d6ef8b] text-[#183d2b] px-5 py-3 rounded-xl font-bold"
                      >
                        {role === "Donor"
                          ? "＋ Add Donation"
                          : "Explore Food"}
                      </button>

                      <button
                        onClick={() => setPage("impact")}
                        className="border border-white/40 px-5 py-3 rounded-xl font-semibold"
                      >
                        View Impact →
                      </button>
                    </div>
                  </div>

                  <div className="absolute right-5 bottom-3 text-[100px] md:text-[140px] opacity-20">
                    🥬
                  </div>
                </div>

                <div className="lg:col-span-2 bg-[#e8efdc] rounded-3xl p-7 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-[#526b48] font-semibold">
                      RESCUE SPOTLIGHT
                    </p>
                    <h3 className="text-2xl font-extrabold text-[#183d2b] mt-3">
                      Waste less.
                      <br />
                      Share more.
                    </h3>
                    <p className="text-sm text-[#526b48] mt-3">
                      Every successful food rescue can make a difference
                      to someone's day.
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-5">
                    <span className="text-6xl">🍱</span>
                    <span className="text-5xl">💚</span>
                    <span className="text-5xl">🌍</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
                {[
                  {
                    label: "Total Donations",
                    value: foods.length,
                    icon: "📦",
                  },
                  {
                    label: "Available Food",
                    value: availableFoods.length,
                    icon: "🍎",
                  },
                  {
                    label: "Food Requested",
                    value: requestedFoods.length,
                    icon: "🤝",
                  },
                  {
                    label: "Food Rescued",
                    value: rescuedQuantity,
                    icon: "💚",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        Live
                      </span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-[#183d2b] mt-4">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Latest Rescue Opportunities
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Fresh food waiting to be redistributed.
                      </p>
                    </div>

                    <button
                      onClick={() => setPage("market")}
                      className="text-sm text-green-800 font-bold"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {availableFoods.slice(0, 2).map((food) => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        role={role}
                        user={user}
                        onUpdate={updateFood}
                        onDelete={deleteFood}
                      />
                    ))}
                  </div>

                  {availableFoods.length === 0 && (
                    <p className="bg-white p-6 rounded-2xl text-gray-500">
                      No available food donations right now.
                    </p>
                  )}
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 text-lg">
                    Rescue Activity
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Current platform overview
                  </p>

                  <div className="mt-7 space-y-6">
                    {[
                      {
                        label: "Available",
                        count: availableFoods.length,
                        color: "bg-green-600",
                      },
                      {
                        label: "Requested",
                        count: requestedFoods.length,
                        color: "bg-amber-500",
                      },
                      {
                        label: "Accepted",
                        count: foods.filter(
                          (food) => food.status === "Accepted"
                        ).length,
                        color: "bg-blue-600",
                      },
                      {
                        label: "Collected",
                        count: collectedFoods.length,
                        color: "bg-gray-500",
                      },
                    ].map((item) => {
                      const percentage = foods.length
                        ? (item.count / foods.length) * 100
                        : 0;

                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-2">
                            <b>{item.label}</b>
                            <span>{item.count}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage("operations")}
                    className="w-full mt-8 border border-gray-200 py-3 rounded-xl text-sm font-bold text-[#183d2b]"
                  >
                    Track Operations →
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-[#e8efdc] rounded-2xl p-6">
                <h3 className="font-bold text-[#183d2b] text-lg">
                  Our Mission
                </h3>
                <p className="text-sm text-[#526b48] mt-2 leading-relaxed">
                  FoodBridge creates a connection between food donors
                  and community organizations. Our goal is to make food
                  redistribution easier, faster and more transparent.
                </p>
              </div>
            </section>
          )}
          {page === "market" && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Food Rescue Market
              </h2>
              <p className="text-gray-500 mt-2">
                Discover surplus food and connect it with communities.
              </p>

              <div className="flex flex-col md:flex-row gap-3 mt-6">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search food or location..."
                  className="flex-1 border rounded-xl p-3"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white border rounded-xl p-3"
                >
                  {[
                    "All",
                    "Cooked Meals",
                    "Bakery",
                    "Fruits",
                    "Vegetables",
                    "Packaged Food",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-gray-500 mt-6 mb-5">
                {filtered.length} rescue opportunities found
              </p>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    role={role}
                    user={user}
                    onUpdate={updateFood}
                    onDelete={deleteFood}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="bg-white rounded-xl p-8 text-center text-gray-500">
                  No food opportunities found.
                </p>
              )}
            </section>
          )}

          {page === "operations" && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                My Operations
              </h2>
              <p className="text-gray-500 mt-2 mb-6">
                Track your donations and food requests.
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                {myFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    role={role}
                    user={user}
                    onUpdate={updateFood}
                    onDelete={deleteFood}
                  />
                ))}
              </div>

              {myFoods.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center">
                  <div className="text-5xl">📋</div>
                  <h3 className="font-bold text-xl mt-4">
                    No activities yet
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Your donations and requests will appear here.
                  </p>
                </div>
              )}
            </section>
          )}

          {page === "impact" && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                Impact Report
              </h2>
              <p className="text-gray-500 mt-2 mb-6">
                See how FoodBridge is helping reduce food waste.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6">
                  <p className="text-sm text-gray-500">
                    Total Donations
                  </p>
                  <h3 className="text-3xl font-bold text-[#183d2b] mt-3">
                    {foods.length}
                  </h3>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <p className="text-sm text-gray-500">
                    Food Listed
                  </p>
                  <h3 className="text-3xl font-bold text-[#183d2b] mt-3">
                    {totalQuantity}
                  </h3>
                </div>

                <div className="bg-white rounded-2xl p-6 col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500">
                    Food Rescued
                  </p>
                  <h3 className="text-3xl font-bold text-green-700 mt-3">
                    {rescuedQuantity}
                  </h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 mt-6">
                <h3 className="font-bold text-lg mb-6">
                  Donation Status
                </h3>

                {[
                  {
                    label: "Available",
                    count: availableFoods.length,
                    color: "bg-green-600",
                  },
                  {
                    label: "Requested",
                    count: requestedFoods.length,
                    color: "bg-amber-500",
                  },
                  {
                    label: "Accepted",
                    count: foods.filter(
                      (food) => food.status === "Accepted"
                    ).length,
                    color: "bg-blue-600",
                  },
                  {
                    label: "Collected",
                    count: collectedFoods.length,
                    color: "bg-gray-500",
                  },
                ].map((item) => (
                  <div key={item.label} className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <b>{item.label}</b>
                      <span>{item.count}</span>
                    </div>

                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{
                          width: `${
                            foods.length
                              ? (item.count / foods.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#e8efdc] rounded-2xl p-7 mt-6">
                <h3 className="text-xl font-bold text-[#183d2b]">
                  Together, We Make a Difference 💚
                </h3>
                <p className="text-sm text-[#526b48] mt-3">
                  Every rescued meal represents an opportunity to
                  reduce waste and support someone in need.
                </p>
              </div>
            </section>
          )}

          <footer className="text-center py-8 mt-10 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Every meal rescued is a step towards a hunger-free community.
            </p>
            <p className="text-xs text-green-700 font-semibold mt-3">
              FoodBridge © 2026
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Rescue Food. Share Hope. Reduce Waste.
            </p>
          </footer>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 my-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#183d2b]">
                Add Food Donation
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-500"
              >
                ×
              </button>
            </div>

            <form onSubmit={addDonation} className="space-y-4">
              <input
                required
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Food name"
                className="w-full border rounded-xl p-3"
              />

              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full border rounded-xl p-3 bg-white"
              >
                <option>Cooked Meals</option>
                <option>Bakery</option>
                <option>Fruits</option>
                <option>Vegetables</option>
                <option>Packaged Food</option>
              </select>

              <input
                required
                type="number"
                min="1"
                name="quantity"
                value={form.quantity}
                onChange={handleFormChange}
                placeholder="Quantity / servings"
                className="w-full border rounded-xl p-3"
              />

              <input
                required
                name="location"
                value={form.location}
                onChange={handleFormChange}
                placeholder="Pickup location"
                className="w-full border rounded-xl p-3"
              />

              <input
                required
                type="datetime-local"
                name="deadline"
                value={form.deadline}
                onChange={handleFormChange}
                className="w-full border rounded-xl p-3"
              />

              <select
                name="condition"
                value={form.condition}
                onChange={handleFormChange}
                className="w-full border rounded-xl p-3 bg-white"
              >
                <option>Fresh</option>
                <option>Freshly prepared</option>
                <option>Packaged and sealed</option>
                <option>Near expiry</option>
              </select>

              <select
                name="storage"
                value={form.storage}
                onChange={handleFormChange}
                className="w-full border rounded-xl p-3 bg-white"
              >
                <option>Room temperature</option>
                <option>Refrigerated</option>
                <option>Frozen</option>
                <option>Temperature controlled</option>
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Additional food details"
                rows="3"
                className="w-full border rounded-xl p-3"
              />

              <p className="text-xs text-gray-500">
                Food condition and storage details are provided by
                the donor and are not independently verified.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border rounded-xl p-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-[#183d2b] text-white rounded-xl p-3 font-bold"
                >
                  Publish Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;