import { TestBed } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';
import { DataType, ContextType } from '../../interfaces/shared.interfaces';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAssignmentConfig', () => {
    it('should return assignment configuration', () => {
      const config = service.getAssignmentConfig();
      
      expect(config.expectedResultType).toBe(DataType.ASSIGNMENT);
      expect(config.contextType).toBe(ContextType.ASSIGNMENT);
      expect(config.strictValidation).toBe(true);
      expect(config.title).toBe('Assignment Expression Editor');
      expect(config.examples).toContain('output.value = input.data');
    });
  });

  describe('getLimitedConnectorConfig', () => {
    it('should return limited connector config without division by default', () => {
      const config = service.getLimitedConnectorConfig();
      
      expect(config.expectedResultType).toBe(DataType.REAL);
      expect(config.contextType).toBe(ContextType.LIMITED_CONNECTOR);
      expect(config.allowDivision).toBe(false);
      expect(config.description).toContain('division disabled');
      expect(config.examples).not.toContain('amount / count');
    });

    it('should return limited connector config with division when enabled', () => {
      const config = service.getLimitedConnectorConfig(true);
      
      expect(config.allowDivision).toBe(true);
      expect(config.description).toContain('+, -, *, / operations');
      expect(config.examples).toContain('amount / count');
      expect(config.examples).toContain('total / 2');
    });
  });

  describe('getBooleanConfig', () => {
    it('should return boolean configuration', () => {
      const config = service.getBooleanConfig();
      
      expect(config.expectedResultType).toBe(DataType.BOOLEAN);
      expect(config.contextType).toBe(ContextType.BOOLEAN);
      expect(config.strictValidation).toBe(true);
      expect(config.title).toBe('Boolean Expression Editor');
      expect(config.examples).toContain('status == "active"');
    });
  });

  describe('getArithmeticConfig', () => {
    it('should return arithmetic configuration', () => {
      const config = service.getArithmeticConfig();
      
      expect(config.expectedResultType).toBe(DataType.REAL);
      expect(config.contextType).toBe(ContextType.ARITHMETIC);
      expect(config.strictValidation).toBe(true);
      expect(config.title).toBe('Arithmetic Expression Editor');
      expect(config.examples).toContain('Math.sqrt(x * x + y * y)');
    });
  });

  describe('getConnectorConfig', () => {
    it('should return connector configuration (same as assignment)', () => {
      const connectorConfig = service.getConnectorConfig();
      const assignmentConfig = service.getAssignmentConfig();
      
      expect(connectorConfig).toEqual(assignmentConfig);
    });
  });

  describe('getGeneralConfig', () => {
    it('should return general configuration', () => {
      const config = service.getGeneralConfig();
      
      expect(config.expectedResultType).toBe(DataType.REAL);
      expect(config.contextType).toBe(ContextType.GENERAL);
      expect(config.strictValidation).toBe(false);
      expect(config.title).toBe('General Expression Editor');
    });
  });

  describe('getPlaceholderForType', () => {
    it('should return correct placeholder for boolean context', () => {
      const config = { contextType: ContextType.BOOLEAN };
      const placeholder = service.getPlaceholderForType(config as any);
      
      expect(placeholder).toContain('boolean condition');
    });

    it('should return correct placeholder for assignment context', () => {
      const config = { contextType: ContextType.ASSIGNMENT };
      const placeholder = service.getPlaceholderForType(config as any);
      
      expect(placeholder).toContain('assignment');
    });

    it('should return correct placeholder for limited connector context', () => {
      const config = { contextType: ContextType.LIMITED_CONNECTOR };
      const placeholder = service.getPlaceholderForType(config as any);
      
      expect(placeholder).toContain('arithmetic expression');
    });

    it('should return correct placeholder for arithmetic context', () => {
      const config = { contextType: ContextType.ARITHMETIC };
      const placeholder = service.getPlaceholderForType(config as any);
      
      expect(placeholder).toContain('mathematical expression');
    });

    it('should return correct placeholder for general context', () => {
      const config = { contextType: ContextType.GENERAL };
      const placeholder = service.getPlaceholderForType(config as any);
      
      expect(placeholder).toContain('Enter your expression here');
    });

    it('should return default placeholder for unknown context', () => {
      const config = { contextType: 'UNKNOWN' as any };
      const placeholder = service.getPlaceholderForType(config as any);
      
      expect(placeholder).toBe('Enter your expression here...');
    });
  });

  describe('configuration consistency', () => {
    
    it('should have consistent structure across all configurations', () => {
      const configs = [
        service.getAssignmentConfig(),
        service.getBooleanConfig(),
        service.getArithmeticConfig(),
        service.getGeneralConfig(),
        service.getLimitedConnectorConfig()
      ];

      configs.forEach(config => {
        expect(config.expectedResultType).toBeDefined();
        expect(config.contextType).toBeDefined();
        expect(config.strictValidation).toBeDefined();
        expect(config.title).toBeDefined();
        expect(config.description).toBeDefined();
        expect(config.placeholder).toBeDefined();
        expect(config.examples).toBeDefined();
        expect(Array.isArray(config.examples)).toBe(true);
      });
    });

    it('should have unique titles for each configuration', () => {
      const configs = [
        service.getAssignmentConfig(),
        service.getBooleanConfig(),
        service.getArithmeticConfig(),
        service.getGeneralConfig(),
        service.getLimitedConnectorConfig()
      ];

      const titles = configs.map(config => config.title);
      const uniqueTitles = new Set(titles);
      
      expect(uniqueTitles.size).toBe(titles.length);
    });
  });
});
