import { fixture, assert, nextFrame } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import '../date-time.js';

describe('<date-time>', () => {
  async function basicFixture() {
    return (await fixture(`
      <date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z"></date-time>`));
  }

  async function longWeekdayFixture() {
    return (await fixture(`
      <date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" weekday="long"></date-time>`));
  }

  async function longMonthFixture() {
    return (await fixture(`
      <date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" month="long"></date-time>`));
  }

  async function numericYearFixture() {
    return (await fixture(`
      <date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" year="numeric"></date-time>`));
  }

  async function numericDayFixture() {
    return (await fixture(`
      <date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" day="numeric"></date-time>`));
  }

  async function numericHourFixture() {
    return (await fixture(`
      <date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" hour="numeric"></date-time>`));
  }

  async function numericMinuteFixture() {
    return (await fixture(`
      <date-time locales="en-US" time-zone="UTC" date="2010-12-10T11:05:45.000Z" minute="numeric"></date-time>`));
  }

  async function numericSecondFixture() {
    return (await fixture(`
      <date-time
        locales="en-US"
        time-zone="UTC"
        date="2010-12-10T11:05:45.000Z"
        second="numeric"></date-time>`));
  }

  async function emptyFixture() {
    return (await fixture(`<date-time></date-time>`));
  }

  async function deutscheFixture() {
    return (await fixture(`
      <date-time locales="de-DE" time-zone="UTC" date="2010-12-10T11:05:45.000Z"></date-time>`));
  }

  async function itempropFixture() {
    return (await fixture(`
      <date-time itemprop="title" date="2010-12-10T11:05:45.000Z"></date-time>`));
  }

  const EDGE_IS_STILL_SO_BAD = /\u200E/g;
  function normalizeString(str) {
    return str.replace(EDGE_IS_STILL_SO_BAD, '');
  }
  const hasSupport = typeof Intl !== 'undefined';
  describe('Basics', () => {
    it('Renders date string value', async () => {
      // Can't check date format at this point since it may vary depending
      // on the locale settings.
      const element = await basicFixture();
      await nextFrame();
      const txt = element._getTimeNode().innerHTML;
      assert.typeOf(txt, 'string');
    });

    it('Should compute ISO time', async () => {
      const element = await basicFixture();
      await nextFrame();
      assert.equal(element._getTimeNode().getAttribute('datetime'), '2010-12-10T11:05:45.000Z');
    });

    it('Should set weekday', async () => {
      if (hasSupport) {
        const element = await longWeekdayFixture();
        await nextFrame();
        const txt = element._getTimeNode().innerHTML;
        assert.equal(normalizeString(txt), 'Friday');
      }
    });

    it('Sets year', async () => {
      if (hasSupport) {
        const element = await numericYearFixture();
        const txt = element._getTimeNode().innerHTML;
        assert.equal(normalizeString(txt), '2010');
      }
    });

    it('Should set month', async () => {
      if (hasSupport) {
        const element = await longMonthFixture();
        const txt = element._getTimeNode().innerHTML;
        assert.equal(normalizeString(txt), 'December');
      }
    });

    it('Should set day', async () => {
      if (hasSupport) {
        const element = await numericDayFixture();
        const txt = element._getTimeNode().innerHTML;
        assert.equal(normalizeString(txt), '10');
      }
    });

    it('Should set hour', async () => {
      if (hasSupport) {
        const element = await numericHourFixture();
        const txt = element._getTimeNode().innerHTML;
        assert.include(normalizeString(txt), '11');
      }
    });

    it('Sets minute', async () => {
      if (hasSupport) {
        const element = await numericMinuteFixture();
        const txt = element._getTimeNode().innerHTML;
        assert.equal(normalizeString(txt), '5');
      }
    });

    it('Sets minute', async () => {
      if (hasSupport) {
        const element = await numericSecondFixture();
        const txt = element._getTimeNode().innerHTML;
        assert.equal(normalizeString(txt), '45');
      }
    });
  });

  describe('Attributes settings', () => {
    let element;
    beforeEach(async () => {
      element = await emptyFixture();
    });

    [
      ['locales'], ['date'], ['year'], ['month'], ['day'], ['hour'], ['minute'], ['second'],
      ['weekday', undefined, 'short'], ['time-zone-name', 'timeZoneName', 'short'],
      ['era', undefined, 'narrow'], ['time-zone', 'timeZone', 'UTC'], ['hour12', undefined, true]
    ].forEach((item) => {
      it(`Calls _updateLabel() when "${item[0]}" attribute changes`, () => {
        const value = item[2] || 'numeric';
        const spy = sinon.spy(element, '_updateLabel');
        element.setAttribute(item[0], value);
        assert.isTrue(spy.called);
      });

      it(`Updates propety value when "${item[0]}" attribute changes`, () => {
        const prop = item[1] || item[0];
        const value = item[2] || 'numeric';
        element.setAttribute(item[0], value);
        if (prop === 'hour12') {
          assert.isTrue(element[prop]);
        } else {
          assert.equal(element[prop], value);
        }
      });
    });
  });

  describe('Properies changed', () => {
    let element;
    beforeEach(async () => {
      element = await emptyFixture();
    });

    [
      ['locales'], ['date'], ['year'], ['month'], ['day'], ['hour'], ['minute'], ['second'],
      ['weekday', undefined, 'short'], ['time-zone-name', 'timeZoneName', 'short'],
      ['era', undefined, 'narrow'], ['time-zone', 'timeZone', 'UTC'], ['hour12', undefined, true]
    ].forEach((item) => {
      it(`Calls _updateLabel() when "${item[0]}" property change`, () => {
        const value = item[2] || 'numeric';
        const prop = item[1] || item[0];
        const spy = sinon.spy(element, '_updateLabel');
        element[prop] = value;
        assert.isTrue(spy.called);
      });

      it(`Updates attribute value when "${item[0]}" property changes`, () => {
        const attr = item[0];
        const prop = item[1] || attr;
        const value = item[2] || 'numeric';
        element[prop] = value;
        assert.isTrue(element.hasAttribute(attr), 'Has corresponding attribute');
        if (prop !== 'hour12') {
          assert.equal(element.getAttribute(attr), value);
        }
      });
    });
  });

  describe('_getIntlOptions()', () => {
    let element;
    beforeEach(async () => {
      element = await emptyFixture();
    });

    [
      ['year'], ['month'], ['day'], ['hour'], ['minute'], ['second'],
      ['weekday', undefined, 'short'], ['time-zone-name', 'timeZoneName', 'short'],
      ['era', undefined, 'narrow'], ['time-zone', 'timeZone', 'UTC'], ['hour12', undefined, true]
    ].forEach((item) => {
      it(`Adds "${item[0]}" property`, () => {
        const attr = item[0];
        const prop = item[1] || attr;
        const value = item[2] || 'numeric';
        element[prop] = value;
        const result = element._getIntlOptions();
        if (prop === 'hour12') {
          assert.isTrue(result[prop]);
        } else {
          assert.equal(result[prop], value);
        }
      });
    });
  });

  describe('_updateLabel()', () => {
    let element;

    it('Does nothing when not in the DOM', async () => {
      element = await basicFixture();
      const parent = element.parentElement;
      parent.removeChild(element);
      const time = element._getTimeNode();
      element.shadowRoot.removeChild(time);
      element.day = 'numeric';
      const node = element.shadowRoot.querySelector('time');
      assert.notOk(node);
    });

    it('Sets "datetime" attribiute on <time>', async () => {
      element = await basicFixture();
      const time = element._getTimeNode();
      assert.equal(time.getAttribute('datetime'), '2010-12-10T11:05:45.000Z');
    });

    it('Sets text content on <time>', async () => {
      element = await basicFixture();
      const time = element._getTimeNode();
      assert.equal(time.innerText.trim().toLowerCase(), '12/10/2010');
    });

    it('Uses different locale', async () => {
      element = await deutscheFixture();
      const time = element._getTimeNode();
      assert.equal(time.innerText.trim().toLowerCase(), '10.12.2010');
    });
  });

  describe('itemprop attribute', () => {
    let element;

    it('Coppies itemprop attribute to <time> element', async () => {
      element = await itempropFixture();
      assert.equal(element._getTimeNode().getAttribute('itemprop'), 'title');
    });

    it('Removes itemprop attribute from this element', async () => {
      element = await itempropFixture();
      assert.equal(element.getAttribute('itemprop'), null);
    });

    it('Ignores the change when attribute is already set', async () => {
      element = await itempropFixture();
      const spy = sinon.spy(element, '_getTimeNode');
      element.itemprop = 'title';
      // Getter uses `_getTimeNode` to read attribute.
      // This should happen only once in theis case.
      assert.isTrue(spy.calledOnce);
    });
  });
});
