/**
 * SieveCache - Caché con algoritmo SIEVE.
 * Usa una lista doblemente enlazada para mantener el orden de acceso
 * y un Map para buscar claves en O(1).
 * El puntero 'hand' recorre la lista durante la evicción:
 * si un nodo fue visitado, lo limpia y sigue;
 * si no fue visitado, lo elimina de la caché.
 */
class SieveCache {
    constructor(capacity) {
        this.capacity = capacity
        this.cache = new Map()
        this.head = null
        this.tail = null
        this.hand = null
    }

    // Inserta un nodo al inicio de la lista (head)
    addnode(node) {
        if (!this.head) {
            this.head = node
            this.tail = node
            this.hand = node
        } else {
            node.next = this.head
            this.head.prev = node
            this.head = node
        }
    }

    // Elimina un nodo de la lista y reconecta sus vecinos
    removeNode(node) {
        if (node.prev) {
            node.prev.next = node.next
        } else {
            this.head = node.next
        }

        if (node.next) {
            node.next.prev = node.prev
        } else {
            this.tail = node.prev
        }

    }

    // Busca una clave en la caché; si existe, marca visited y devuelve el valor
    get(key) {
        if (!this.cache.has(key)) {
            return null
        }

        const node = this.cache.get(key)
        node.visited = true
        return node.value
    }

    // Inserta o actualiza un par clave-valor; desaloja si supera la capacidad
    set(key, value) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key)
            node.value = value
            node.visited = true
            return
        }

        // Evicción SIEVE: desde hand, busca el primer nodo no visitado
        if (this.cache.size >= this.capacity) {
            while (this.hand.visited) {
                this.hand.visited = false
                this.hand = this.hand.next || this.head
            }
            const nodeToRemove = this.hand
            this.removeNode(nodeToRemove)
            this.cache.delete(nodeToRemove.key)
            this.hand = nodeToRemove.next || this.head
        }

        const newNode = new Node(key, value)
        this.addnode(newNode)
        this.cache.set(key, newNode)
    }


}

// Node - Nodo de la lista doblemente enlazada.
// Guarda la clave, el valor y si fue visitado para la lógica de evicción SIEVE.
class Node {
    constructor(key, value) {
        this.key = key
        this.value = value
        this.visited = false
        this.prev = null
        this.next = null
    }
}

module.exports = SieveCache


