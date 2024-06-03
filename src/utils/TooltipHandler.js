export class TooltipHandler {
  constructor() {
    this.activeTooltip = null;
    this.tooltipTimeout = null;
    this.isSidebarTransitioning = false;
  }

  initializeTooltips(container = document) {
    container.querySelectorAll('[data-tooltip]').forEach(element => {
      this.addTooltipListeners(element);
    });
  }

  addTooltipListeners(element) {
    element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    element.addEventListener('click', this.handleClick.bind(this));
  }

  handleMouseEnter(event) {
    if (this.isSidebarTransitioning || document.body.classList.contains('grabbing')) return;

    clearTimeout(this.tooltipTimeout);
    const element = event.target;
    
    this.tooltipTimeout = setTimeout(() => {
      if (this.activeTooltip) {
        this.activeTooltip.remove();
      }

      const tooltipText = element.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      document.body.appendChild(tooltip);
      this.activeTooltip = tooltip;

      this.adjustTooltipPosition(tooltip, element);
    }, 300);
  }

  handleMouseLeave() {
    clearTimeout(this.tooltipTimeout);
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
    }
  }

  handleClick() {
    clearTimeout(this.tooltipTimeout);
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
    }
  }

  adjustTooltipPosition(tooltip, targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    left = Math.max(left, 5);
    left = Math.min(left, window.innerWidth - tooltipWidth - 5);
    tooltip.style.left = `${left}px`;

    let top = rect.top + window.scrollY - tooltipHeight - 10;
    let arrowDirection = 'top';
    if (top < 5) {
        top = rect.bottom + window.scrollY + 10;
        arrowDirection = 'bottom';
    }
    tooltip.style.top = `${top}px`;

    this.createTooltipArrow(tooltip, targetElement, arrowDirection, left);
  }

  createTooltipArrow(tooltip, targetElement, arrowDirection, left) {
    const svgIcon = targetElement.querySelector('svg');
    const svgRect = svgIcon ? svgIcon.getBoundingClientRect() : targetElement.getBoundingClientRect();

    let arrowLeft;
    if (targetElement.id === 'darkmode-toggle-label') {
        arrowLeft = svgRect.left + svgRect.width / 2 - left;
    } else {
        arrowLeft = svgRect.left + svgRect.width / 2 - left;
    }

    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderStyle = 'solid';
    arrow.style.borderWidth = arrowDirection === 'bottom' ? '0 5px 5px 5px' : '5px 5px 0 5px';
    arrow.style.borderColor = arrowDirection === 'bottom' ? 'transparent transparent #333 transparent' : '#333 transparent transparent transparent';
    arrow.style.left = `${arrowLeft}px`;
    arrow.style.transform = 'translateX(-50%)';

    if (arrowDirection === 'bottom') {
        arrow.style.top = '-5px';
    } else {
        arrow.style.bottom = '-5px';
    }

    tooltip.appendChild(arrow);
  }
}
