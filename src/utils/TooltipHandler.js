export class TooltipHandler {
  constructor() {
    this.activeTooltip = null;
    this.tooltipTimeout = null;
    this.isSidebarTransitioning = false; // Used to check if the sidebar is transitioning to avoid showing and duplicating tooltips during transition
  }

  // Initialize tooltips for the entire document
  initializeTooltips() {
    const excludeContainers = ['todo-lists-container', 'todo-list'];

    // Find all elements with data-tooltip attribute, excluding children of certain containers
    const tooltipElements = [...document.querySelectorAll('[data-tooltip]')].filter((element) => {
      return !excludeContainers.some((id) => element.closest(`#${id}`));
    });

    // Add event listeners to found elements
    tooltipElements.forEach(this.addEventListeners.bind(this));

    // Use event delegation for containers with many buttons to limit the number of event listeners
    excludeContainers.forEach((containerId) => {
      const listContainer = document.getElementById(containerId);
      if (listContainer) {
        this.addEventListeners(listContainer);
      }
    });
  }

  // Add event listeners to a single element
  addEventListeners(element) {
    element.addEventListener('mouseover', this.handleMouseOver.bind(this));
    element.addEventListener('mouseout', this.handleMouseLeave.bind(this));
    element.addEventListener('click', this.handleClick.bind(this));
  }

  handleMouseOver(event) {
    const element = event.target.closest('[data-tooltip]');
    if (!element || this.isSidebarTransitioning || document.body.classList.contains('grabbing')) return;

    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.showTooltip(element);
    }, 300); // Show tooltip after 300ms delay
  }

  handleMouseLeave(event) {
    clearTimeout(this.tooltipTimeout);
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
    }
  }

  handleClick(event) {
    clearTimeout(this.tooltipTimeout);
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
    }
  }

  showTooltip(element) {
    this.hideTooltip(); // Remove any existing tooltip
    const tooltipText = element.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;

    const arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';
    tooltip.appendChild(arrow);

    document.body.appendChild(tooltip);
    this.activeTooltip = tooltip;
    this.adjustTooltipPosition(tooltip, element);
  }

  hideTooltip() {
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
    }
  }

  adjustTooltipPosition(tooltip, targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    // Calculate the horizontal position of the tooltip
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    left = Math.max(left, 5); // Ensure tooltip does not overflow on the left
    left = Math.min(left, window.innerWidth - tooltipWidth - 5); // Ensure tooltip does not overflow on the right
    
    // Calculate the vertical position of the tooltip, including scroll offset
    let top = rect.top + window.scrollY - tooltipHeight - 10; // window.scrollY ensures correct positioning when the page is scrolled
    let arrowDirection = 'top';
    if (top < 5) { // If tooltip would overflow on the top
      top = rect.bottom + window.scrollY + 10;
      arrowDirection = 'bottom';
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    this.updateArrow(tooltip, targetElement, arrowDirection, left);
  }

  updateArrow(tooltip, targetElement, arrowDirection, left) {
    const arrow = tooltip.querySelector('.tooltip-arrow');
    let arrowLeft;

    if (targetElement.id === 'darkmode-toggle-label') {
        // Special positioning for darkmode-toggle-label
        // This element uses a hidden checkbox and label to simulate a switch
        const labelRect = targetElement.getBoundingClientRect();
        arrowLeft = labelRect.left + labelRect.width / 2 - left;
    } else {
        // Standard positioning for elements or elements with SVG icon
        const svgIcon = targetElement.querySelector('svg');
        const svgRect = svgIcon ? svgIcon.getBoundingClientRect() : targetElement.getBoundingClientRect();
        arrowLeft = svgRect.left + svgRect.width / 2 - left;
    }

    // Set arrow styles
    arrow.style.left = `${arrowLeft}px`;
    arrow.style.transform = 'translateX(-50%)'; // Center the arrow horizontally

    if (arrowDirection === 'bottom') {
        // Arrow pointing downwards
        arrow.style.borderWidth = '0 5px 5px 5px'; // The top border is 0 to create a downward pointing arrow
        arrow.style.borderColor = 'transparent transparent #333 transparent'; // Only the bottom border is colored
        arrow.style.top = '-5px'; // Position the arrow above the tooltip
        arrow.style.bottom = ''; // Clear the bottom property if set previously
    } else {
        // Arrow pointing upwards
        arrow.style.borderWidth = '5px 5px 0 5px'; // The bottom border is 0 to create an upward pointing arrow
        arrow.style.borderColor = '#333 transparent transparent transparent'; // Only the top border is colored
        arrow.style.bottom = '-5px'; // Position the arrow below the tooltip
        arrow.style.top = ''; // Clear the top property if set previously
    }
  }
}
