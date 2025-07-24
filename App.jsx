import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';

// Shadcn UI components (simulated for demonstration)

const Button = ({ children, onClick, className = '', type = 'button', variant = 'default', disabled = false }) => {
  let baseStyle = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';

  if (variant === 'default') {
    baseStyle += ' text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  } else if (variant === 'outline') {
    baseStyle += ' border border-blue-600 text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  } else if (variant === 'destructive') {
    baseStyle += ' text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2';
  } else if (variant === 'ghost') {
    baseStyle += ' text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2';
  }

  if (disabled) {
    baseStyle += ' opacity-50 cursor-not-allowed';
  }

  return (
    <button type={type} className={`${baseStyle} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const Input = ({ type = 'text', placeholder, value, onChange, className = '', id = '', rows = 1, multiple = false }) => {
  if (type === 'textarea') { // Use type="textarea" explicitly for multiline input
    return (
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      ></textarea>
    );
  }

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      multiple={multiple} // For file inputs or future multi-select
    />
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const Label = ({ htmlFor, children, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
);

const Select = ({ children, value, onChange, className = '', id = '', multiple = false }) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    multiple={multiple}
  >
    {children}
  </select>
);

const Dialog = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose} className="p-1">
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Context for managing application state
const AppContext = createContext();

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Sample data and state management
const AppProvider = ({ children }) => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', description: 'First item', category: 'Category A', completed: false },
    { id: 2, name: 'Item 2', description: 'Second item', category: 'Category B', completed: true },
    { id: 3, name: 'Item 3', description: 'Third item', category: 'Category A', completed: false },
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const addItem = useCallback((item) => {
    setItems(prev => [...prev, { ...item, id: Date.now() }]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === 'completed') return item.completed && matchesSearch;
      if (filter === 'pending') return !item.completed && matchesSearch;
      return matchesSearch;
    });
  }, [items, filter, searchTerm]);

  const value = {
    items,
    filteredItems,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    addItem,
    updateItem,
    deleteItem
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Item form component
const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || 'Category A'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="Enter item name"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="textarea"
          rows={3}
          value={formData.description}
          onChange={handleChange('description')}
          placeholder="Enter item description"
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          value={formData.category}
          onChange={handleChange('category')}
        >
          <option value="Category A">Category A</option>
          <option value="Category B">Category B</option>
          <option value="Category C">Category C</option>
        </Select>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit">
          {item ? 'Update' : 'Add'} Item
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// Item list component
const ItemList = () => {
  const { filteredItems, updateItem, deleteItem } = useAppContext();
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleUpdate = (formData) => {
    updateItem(editingItem.id, formData);
    setEditingItem(null);
  };

  const handleToggleComplete = (item) => {
    updateItem(item.id, { completed: !item.completed });
  };

  return (
    <div className="space-y-4">
      {filteredItems.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center">No items found</p>
        </Card>
      ) : (
        filteredItems.map(item => (
          <Card key={item.id} className={item.completed ? 'opacity-75' : ''}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                  {item.name}
                </h3>
                <p className={`text-sm mt-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {item.category}
                </span>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  onClick={() => handleToggleComplete(item)}
                  className="text-sm"
                >
                  {item.completed ? 'Undo' : 'Complete'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="text-sm"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteItem(item.id)}
                  className="text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      <Dialog
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Item"
      >
        {editingItem && (
          <ItemForm
            item={editingItem}
            onSubmit={handleUpdate}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </Dialog>
    </div>
  );
};

// Main app component
const App = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { filter, setFilter, searchTerm, setSearchTerm, addItem } = useAppContext();

  const handleAddItem = (formData) => {
    addItem(formData);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Item Manager</h1>
          
          {/* Controls */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="sm:w-48">
                <Label htmlFor="filter">Filter</Label>
                <Select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Items</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </Select>
              </div>
              
              <div className="sm:w-32 flex items-end">
                <Button onClick={() => setShowAddForm(true)} className="w-full">
                  Add Item
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Item List */}
        <ItemList />

        {/* Add Item Dialog */}
        <Dialog
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Add New Item"
        >
          <ItemForm
            onSubmit={handleAddItem}
            onCancel={() => setShowAddForm(false)}
          />
        </Dialog>
      </div>
    </div>
  );
};

// Root component with provider
const AppWithProvider = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWithProvider;