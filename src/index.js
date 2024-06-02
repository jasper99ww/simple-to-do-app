import { TodoModel } from './model/TodoModel.js';
import { TodoView } from './view/TodoView.js';
import { TodoListPanel } from './view/TodoListPanel.js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  const lists = JSON.parse(localStorage.getItem('todoLists') || '{}');
  const content = document.querySelector('.flex-container');
  const emptyPrompt = document.querySelector('.flex-container-prompt');
  
  const model = new TodoModel();
  const view = new TodoView(model);
  const listPanel = new TodoListPanel(model);

  let activeTooltip = null;
  let isSidebarTransitioning = false;
  let tooltipTimeout;

    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (isSidebarTransitioning) return;
            
            tooltipTimeout = setTimeout(() => {
                if (activeTooltip) {
                    activeTooltip.remove();
                    activeTooltip = null;
                }

                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.textContent = tooltipText;
                tooltip.style.position = 'absolute';
                tooltip.style.backgroundColor = '#333';
                tooltip.style.color = 'white';
                tooltip.style.borderRadius = '4px';
                tooltip.style.padding = '5px 10px';
                tooltip.style.zIndex = '10000';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.whiteSpace = 'nowrap';
                tooltip.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.3)';

                document.body.appendChild(tooltip);
                activeTooltip = tooltip;

                adjustTooltipPosition(tooltip, this);
            }, 300);
        });

        element.addEventListener('mouseleave', function() {
            clearTimeout(tooltipTimeout);
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
        });

        element.addEventListener('click', function() {
            console.log("CICKED");
            clearTimeout(tooltipTimeout);
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
        });
    });

    function adjustTooltipPosition(tooltip, targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        let left = rect.left + rect.width / 2 - tooltipWidth / 2;
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

        createTooltipArrow(tooltip, targetElement, arrowDirection, left);
    }

    function createTooltipArrow(tooltip, targetElement, arrowDirection, left) {
        const svgIcon = targetElement.querySelector('svg');
        const svgRect = svgIcon ? svgIcon.getBoundingClientRect() : targetElement.getBoundingClientRect();

        let arrowLeft;
        if (targetElement.id === 'darkmode-toggle-label') {
            const labelRect = targetElement.getBoundingClientRect();
            arrowLeft = labelRect.left + labelRect.width / 2 - left;
        } else {
            arrowLeft = svgRect.left + svgRect.width / 2 - left;
        }

        const arrow = document.createElement('div');
        arrow.style.position = 'absolute';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderStyle = 'solid';
        arrow.style.borderWidth = '0 5px 5px 5px';
        arrow.style.borderColor = 'transparent transparent #333 transparent';
        arrow.style.left = `${arrowLeft}px`;
        arrow.style.transform = 'translateX(-50%)';

        if (arrowDirection === 'bottom') {
            arrow.style.top = '-5px';
        } else {
            arrow.style.bottom = '-5px';
            arrow.style.borderWidth = '5px 5px 0 5px';
            arrow.style.borderColor = '#333 transparent transparent transparent';
        }

        tooltip.appendChild(arrow);
    }

    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    toggleSidebarBtn.addEventListener('click', () => {
        isSidebarTransitioning = true;
        clearTimeout(tooltipTimeout);
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
        setTimeout(() => isSidebarTransitioning = false, 500);
    });
});
