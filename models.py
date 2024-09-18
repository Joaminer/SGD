import sqlite3
from tenacity import retry, stop_after_attempt, wait_fixed

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def insert_material(db, categoria, modelo, tipo, ubicacion, cantidad, unidad, estado, stock_critico):
    cursor = db.cursor()
    try:
        cursor.execute('''
            INSERT INTO items (categoria, modelo, tipo, ubicacion, cantidad, unidad, estado, stock_critico)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (categoria, modelo, tipo, ubicacion, cantidad, unidad, estado, stock_critico))
        db.commit()
    finally:
        cursor.close()

def get_items(db):
    cursor = db.cursor()
    try:
        cursor.execute('SELECT * FROM items')
        return cursor.fetchall()
    finally:
        cursor.close()

def update_material(db, id, quantity):
    cursor = db.cursor()
    try:
        cursor.execute('UPDATE items SET cantidad = ? WHERE id = ?', (quantity, id))
        db.commit()
    finally:
        cursor.close()

def delete_material(db, id):
    cursor = db.cursor()
    try:
        cursor.execute('DELETE FROM items WHERE id = ?', (id,))
        db.commit()
    finally:
        cursor.close()
