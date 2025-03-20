import React from 'react';
import useCharacter from '../../hooks/useCharacter';
import './CharacterSheet.css';

const CharacterSheet = () => {
  const { character } = useCharacter();

  return (
    <div className="character-sheet">
      <div className="character-header">
        <h2>Character Sheet</h2>
      </div>
      
      <div className="character-content">
        <div className="character-basic-info">
          <h3>{character.name}</h3>
          <div className="character-details">
            <span>Level {character.level} {character.race} {character.class}</span>
            <span>{character.alignment}</span>
            <span>Background: {character.background}</span>
          </div>
        </div>
        
        <div className="character-stats">
          <h3>Ability Scores</h3>
          <div className="ability-scores">
            {Object.entries(character.abilityScores).map(([ability, score]) => (
              <div key={ability} className="ability-score">
                <div className="ability-label">{ability.charAt(0).toUpperCase() + ability.slice(1)}</div>
                <div className="ability-value">{score}</div>
                <div className="ability-modifier">{Math.floor((score - 10) / 2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="character-combat">
          <h3>Combat Stats</h3>
          <div className="combat-stats">
            <div className="combat-stat">
              <div className="stat-label">Hit Points</div>
              <div className="stat-value">
                {character.combatStats.hitPoints.current} / {character.combatStats.hitPoints.max}
              </div>
            </div>
            <div className="combat-stat">
              <div className="stat-label">Armor Class</div>
              <div className="stat-value">{character.combatStats.armorClass}</div>
            </div>
            <div className="combat-stat">
              <div className="stat-label">Initiative</div>
              <div className="stat-value">+{character.combatStats.initiative}</div>
            </div>
            <div className="combat-stat">
              <div className="stat-label">Speed</div>
              <div className="stat-value">{character.combatStats.speed} ft</div>
            </div>
          </div>
        </div>
        
        <div className="character-features">
          <h3>Features & Traits</h3>
          <ul className="features-list">
            {character.features.map((feature, index) => (
              <li key={index} className="feature-item">
                <h4>{feature.name}</h4>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="character-inventory">
          <h3>Inventory</h3>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Weight</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {character.inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.weight * item.quantity} lb</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;