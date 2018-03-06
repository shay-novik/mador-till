document.addEventListener("DOMContentLoaded", (event) => {
  // Hamburger menu
  let hamburger_icon = document.querySelector("#js-hamburger"),
    hamburger_menu = document.querySelector("#js-nav-menu"),
    navigation_links = document.querySelectorAll("#js-nav-menu .link");

  // Open/close the menu
  hamburger_icon.addEventListener("click", () => {
    hamburger_menu.classList.toggle("navigation--active");
    console.log("hamburger clicked")
  });

  navigation_links.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger_menu.classList.toggle("navigation--active");
      console.log("link clicked")
    })
  });

  class ResponsiveBackgroundImage {

    constructor(element) {
      try {
        this.element = element;
        this.img = element.querySelector('#js-responsive-img');
        this.src = '';

        this.img.addEventListener('load', () => {
          this.update();
        });

        if (this.img.complete) {
          this.update();
        }
      } catch (e) {
        console.log(e);
      }
    }

    update() {
      let src = typeof this.img.currentSrc !== 'undefined' ? this.img.currentSrc : this.img.src;
      if (this.src !== src) {
        this.src = src;
        this.element.style.backgroundImage = 'url("' + this.src + '")';

      }
    }
  }
  new ResponsiveBackgroundImage(document.querySelector('#js-header'));
});