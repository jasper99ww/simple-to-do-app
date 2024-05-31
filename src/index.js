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

document.querySelectorAll('[data-tooltip]').forEach(element => {
    let tooltipTimeout;

    element.addEventListener('mouseenter', function() {
        tooltipTimeout = setTimeout(() => {
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

            const rect = this.getBoundingClientRect();
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            let left = rect.left + rect.width / 2 - tooltipWidth / 2;
            left = Math.max(left, 5); // Prevent tooltip from being cut off on the left side
            left = Math.min(left, window.innerWidth - tooltipWidth - 5); // Prevent tooltip from being cut off on the right side
            tooltip.style.left = `${left}px`;

            let top = rect.top + window.scrollY - tooltipHeight - 5;
            let arrowDirection = 'top';

            if (top < 5) {
                top = rect.bottom + window.scrollY + 5;
                arrowDirection = 'bottom';
            }
            tooltip.style.top = `${top}px`;

            const svgIcon = element.querySelector('svg');
            const svgRect = svgIcon ? svgIcon.getBoundingClientRect() : rect;
            const arrow = document.createElement('div');
            arrow.style.position = 'absolute';
            arrow.style.width = '0';
            arrow.style.height = '0';
            arrow.style.borderStyle = 'solid';
            arrow.style.borderWidth = '0 5px 5px 5px'; // Reversed border width for bottom arrow
            arrow.style.borderColor = 'transparent transparent #333 transparent'; // Reversed border color for bottom arrow

            let arrowLeft;
            if (element.id === 'darkmode-toggle') {
                const labelRect = element.querySelector('label').getBoundingClientRect();
                arrowLeft = labelRect.left + labelRect.width / 2 - left;
            } else {
                arrowLeft = svgRect.left + svgRect.width / 2 - left;
            }

            arrow.style.left = `${arrowLeft}px`;
            arrow.style.transform = 'translateX(-50%)';

            if (arrowDirection === 'bottom') {
                arrow.style.top = '-5px'; // Position arrow for bottom tooltip
            } else {
                arrow.style.bottom = '-5px'; // Position arrow for top tooltip
                arrow.style.borderWidth = '5px 5px 0 5px'; // Normal border width for top arrow
                arrow.style.borderColor = '#333 transparent transparent transparent'; // Normal border color for top arrow
            }

            tooltip.appendChild(arrow);
        }, 300);
    });

    element.addEventListener('mouseleave', function() {
        clearTimeout(tooltipTimeout);
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
    });
});

const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
toggleSidebarBtn.addEventListener('click', () => {
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }
});




  
  
  


  

  
  
  
  



});
