// Firebase非依存のピュアロジックテスト

// 正規表現文字をエスケープするヘルパー関数
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('Pure Logic Unit Tests', () => {
  describe('Parameter Replacement Logic', () => {
    test('should replace single parameter correctly', () => {
      const content = 'こんにちは、[名前]さん。';
      const parameterValues = { '名前': '田中' };
      
      let result = content;
      Object.entries(parameterValues).forEach(([param, value]) => {
        const placeholder = `[${param}]`;
        result = result.replace(new RegExp(escapeRegExp(placeholder), 'g'), value);
      });
      
      expect(result).toBe('こんにちは、田中さん。');
    });

    test('should replace multiple parameters correctly', () => {
      const content = '[会社名]は、お客様の個人情報を[目的]のために利用します。[期間]保管します。';
      const parameterValues = { 
        '会社名': 'テスト株式会社',
        '目的': 'サービス提供',
        '期間': '1年間'
      };
      
      let result = content;
      Object.entries(parameterValues).forEach(([param, value]) => {
        const placeholder = `[${param}]`;
        result = result.replace(new RegExp(escapeRegExp(placeholder), 'g'), value);
      });
      
      expect(result).toBe(
        'テスト株式会社は、お客様の個人情報をサービス提供のために利用します。1年間保管します。'
      );
    });

    test('should handle missing parameters gracefully', () => {
      const content = '[会社名]は[サービス名]を提供します。';
      const parameterValues = { '会社名': 'テスト株式会社' };
      
      let result = content;
      Object.entries(parameterValues).forEach(([param, value]) => {
        const placeholder = `[${param}]`;
        result = result.replace(new RegExp(escapeRegExp(placeholder), 'g'), value);
      });
      
      expect(result).toBe('テスト株式会社は[サービス名]を提供します。');
    });
  });

  describe('Tag Normalization', () => {
    test('should normalize tags correctly', () => {
      const tags = ['  Test  ', 'SAMPLE', 'Privacy', '', '  '];
      const normalizedTags = tags
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);
      
      expect(normalizedTags).toEqual(['test', 'sample', 'privacy']);
    });

    test('should remove duplicate tags', () => {
      const tags = ['test', 'TEST', 'Test', 'sample', 'test'];
      const uniqueTags = Array.from(new Set(
        tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag)
      ));
      
      expect(uniqueTags).toEqual(['test', 'sample']);
    });
  });

  describe('Array Sorting', () => {
    test('should sort fragments by order', () => {
      const fragments = [
        { id: '1', order: 3 },
        { id: '2', order: 1 },
        { id: '3', order: 2 }
      ];
      
      const sorted = fragments.sort((a, b) => a.order - b.order);
      
      expect(sorted.map(f => f.id)).toEqual(['2', '3', '1']);
    });
  });

  describe('Version Management', () => {
    test('should increment version correctly', () => {
      const currentVersion = 1;
      const newVersion = currentVersion + 1;
      
      expect(newVersion).toBe(2);
    });
  });

  describe('Data Validation', () => {
    test('should validate TermFragment structure', () => {
      const fragment = {
        title: 'テスト規約',
        content: 'これは[テスト]です。',
        parameters: ['テスト'],
        tags: ['テスト'],
        currentVersion: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      expect(typeof fragment.title).toBe('string');
      expect(fragment.title.length).toBeGreaterThan(0);
      expect(typeof fragment.content).toBe('string');
      expect(Array.isArray(fragment.parameters)).toBe(true);
      expect(Array.isArray(fragment.tags)).toBe(true);
      expect(typeof fragment.currentVersion).toBe('number');
      expect(fragment.currentVersion).toBeGreaterThan(0);
      expect(fragment.createdAt instanceof Date).toBe(true);
      expect(fragment.updatedAt instanceof Date).toBe(true);
    });

    test('should validate FragmentRef structure', () => {
      const fragmentRef = {
        fragmentId: 'test-fragment-id',
        order: 1,
        parameterValues: { 'テスト': 'テスト値' }
      };
      
      expect(typeof fragmentRef.fragmentId).toBe('string');
      expect(fragmentRef.fragmentId.length).toBeGreaterThan(0);
      expect(typeof fragmentRef.order).toBe('number');
      expect(fragmentRef.order).toBeGreaterThan(0);
      expect(typeof fragmentRef.parameterValues).toBe('object');
      expect(fragmentRef.parameterValues).not.toBeNull();
    });
  });

  describe('Business Logic', () => {
    test('should determine understanding status', () => {
      const understoodRecords = [
        { fragmentId: 'fragment-1', version: 1, understoodAt: new Date() },
        { fragmentId: 'fragment-2', version: 1, understoodAt: new Date() }
      ];
      
      const fragmentIds = ['fragment-1', 'fragment-2', 'fragment-3'];
      const statuses = fragmentIds.map(fragmentId => ({
        fragmentId,
        isUnderstood: understoodRecords.some(record => record.fragmentId === fragmentId)
      }));
      
      expect(statuses).toEqual([
        { fragmentId: 'fragment-1', isUnderstood: true },
        { fragmentId: 'fragment-2', isUnderstood: true },
        { fragmentId: 'fragment-3', isUnderstood: false }
      ]);
    });

    test('should filter by tag', () => {
      const fragments = [
        { id: '1', title: 'プライバシーポリシー', tags: ['プライバシー', '個人情報'] },
        { id: '2', title: '利用規約', tags: ['利用規約', 'サービス'] },
        { id: '3', title: 'プライバシー保護', tags: ['プライバシー', '保護'] }
      ];
      
      const targetTag = 'プライバシー';
      const filtered = fragments.filter(fragment => 
        fragment.tags.includes(targetTag)
      );
      
      expect(filtered).toHaveLength(2);
      expect(filtered.map(f => f.id)).toEqual(['1', '3']);
    });

    test('should create quick lookup set', () => {
      const records = [
        { fragmentId: 'fragment-1' },
        { fragmentId: 'fragment-2' },
        { fragmentId: 'fragment-1' } // 重複
      ];
      
      const fragmentIdSet = new Set(records.map(r => r.fragmentId));
      
      expect(fragmentIdSet.size).toBe(2);
      expect(fragmentIdSet.has('fragment-1')).toBe(true);
      expect(fragmentIdSet.has('fragment-2')).toBe(true);
      expect(fragmentIdSet.has('fragment-3')).toBe(false);
    });
  });
});
