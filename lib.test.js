/* eslint-disable no-undef */

import * as lib from './lib';

describe(lib.getTags, () => {
  test('single commit with tag', () => {
    expect(lib.getTags(['Fixed AB#1233'])).toEqual(['AB#1233']);
  });

  test('single commit with multiple tags', () => {
    expect(
      lib.getTags(['Fixed AB#1233,AB#7654 AB#13245512']),
    ).toEqual(['AB#1233', 'AB#7654', 'AB#13245512']);
  });

  test('multiple commits with multiple tags', () => {
    expect(
      lib.getTags(['Fixed AB#1233,AB#7654 AB#13245512', 'Another fix AB#1242']),
    ).toEqual(['AB#1233', 'AB#7654', 'AB#13245512', 'AB#1242']);
  });

  test('distinct tags returned', () => {
    expect(
      lib.getTags([
        'Fixed AB#1233,AB#7654 AB#13245512, AB#1242',
        'Another fix AB#1242, AB#13245512, AB#123',
      ]),
    ).toEqual(['AB#1233', 'AB#7654', 'AB#13245512', 'AB#1242', 'AB#123']);
  });

  test('single commit with no tags', () => {
    expect(lib.getTags(['Fixed an item'])).toEqual([]);
  });

  test('single commits with no tags', () => {
    expect(lib.getTags(['Fixed an item', 'Fixed another one'])).toEqual([]);
  });

  test('malformed tags', () => {
    expect(lib.getTags(['AB123', '#1245', '#AB123'])).toEqual([]);
  });

  test('tag with alpha characters', () => {
    expect(lib.getTags(['AB#abc'])).toEqual([]);
  });

  test('tag with no id', () => {
    expect(lib.getTags(['AB#'])).toEqual([]);
  });
});

describe(lib.throwIfNotPushEvent, () => {
  test('non-push event', () => {
    const EVENT = 'pull_request';
    expect(
      () => lib.throwIfNotPushEvent(EVENT),
    ).toThrow(new TypeError(`Action is only compatible for push events. Received: ${EVENT}`));
  });

  test('push event', () => {
    expect(() => lib.throwIfNotPushEvent('push')).not.toThrow();
  });
});
