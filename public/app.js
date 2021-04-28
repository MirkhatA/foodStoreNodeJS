document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(node.textContent)
})

const $card = document.querySelector('#card')

if ($card) {
    $card.addEventListener('click', event => {
        console.log(event)
    })
}