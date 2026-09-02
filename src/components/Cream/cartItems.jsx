export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
      <div>
        <h4>{item.nameTh}</h4>
        <p>ราคา: {item.price} บาท</p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => onUpdateQuantity(item._id, -1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item._id, 1)}>+</button>
        
        <button 
          onClick={() => onRemove(item._id)}
          style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
        >
          ลบ
        </button>
      </div>
    </div>
  );
}