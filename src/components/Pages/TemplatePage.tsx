import React from 'react';
import DraggableComponent from '../Editor/DraggableComponent';
import { Component, MediaItem } from '../../types';

interface TemplatePageProps {
  components: Component[];
  isPreviewMode?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  onComponentUpdate?: (componentId: string, updates: Partial<Component>) => void;
  onComponentSelect?: (componentId: string) => void;
  selectedComponentId?: string;
  mediaLibrary?: MediaItem[];
  onAddToMediaLibrary?: (file: File, url: string) => MediaItem;
}

const TemplatePage: React.FC<TemplatePageProps> = ({
  components,
  isPreviewMode = true,
  viewMode = 'desktop',
  onComponentUpdate,
  onComponentSelect,
  selectedComponentId,
  mediaLibrary,
  onAddToMediaLibrary
}) => {
  // Find the maximum Y position to determine canvas height
  const maxY = components.reduce((max, component) => {
    const componentBottom = component.position.y + (parseInt(component.size.height) || 200);
    return Math.max(max, componentBottom);
  }, 0);

  const canvasHeight = maxY + 200; // Add some padding at the bottom

  return (
    <div 
      className="template-page relative bg-white"
      style={{ 
        minHeight: `${canvasHeight}px`,
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {components.map((component) => (
        <DraggableComponent
          key={component.id}
          component={component}
          isSelected={selectedComponentId === component.id}
          onUpdate={(updates) => onComponentUpdate?.(component.id, updates)}
          onSelect={() => onComponentSelect?.(component.id)}
          isPreviewMode={isPreviewMode}
          viewMode={viewMode}
          snapToGrid={true}
          mediaLibrary={mediaLibrary}
          onAddToMediaLibrary={onAddToMediaLibrary}
        />
      ))}
    </div>
  );
};

export default TemplatePage;
