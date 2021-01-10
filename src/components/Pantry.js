import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ tabs, activeTab, onTabClick }) => (
  <div className="Pantry__button-container">
    {tabs.map((tab) => (
      <button
        className={
          tab.id === activeTab
            ? "Pantry__button Pantry__button--active"
            : "Pantry__button"
        }
        onClick={() => onTabClick(tab.id)}
      >
        {tab.title}
      </button>
    ))}
  </div>
);

const Pantry = ({ inventory, groceries, onAddToList, onDeleteFromList }) => {
  const [activeTab, setActiveTab] = useState("groceries");
  const [ingredientToAdd, setIngredientToAdd] = useState("");

  const addIngredient = (e) => {
    e.preventDefault();
    onAddToList([ingredientToAdd], activeTab);
    setIngredientToAdd('');
  }

  const deleteIngredient = (index, tab) => {
    onDeleteFromList(index, activeTab)
  }

  const getList = (items) => items.map((item, i) => (
    <li key={i} value={i}>
      <span className="Recipe__ingredients__status green"></span>
      {item}
      <span onClick={() => deleteIngredient(i)}>  x</span>
    </li>
  ));

  return (
    <div className="Pantry">
      <h2 className="Pantry__title">Pantry</h2>
      <Tabs
        tabs={[
          { id: "groceries", title: "Grocery List" },
          { id: "inventory", title: "Inventory" },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <form onSubmit={addIngredient}>
        <input
          className="Navigation__input"
          type="text"
          placeholder="Add Ingredient"
          value={ingredientToAdd}
          onChange={(e) => setIngredientToAdd(e.target.value)}
        />
      </form>
      {
        {
          'inventory': <ul className="Pantry__ingredients">{getList(inventory)}</ul>,
          'groceries': <ul className="Pantry__ingredients">{getList(groceries)}</ul>
        }[activeTab]
      }
    </div>
  );
}

Pantry.propTypes = {
  inventory: PropTypes.array.isRequired,
  groceries: PropTypes.array.isRequired
};

export default Pantry;
