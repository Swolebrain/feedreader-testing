/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
         it('have non-empty URLs', function(){
           expect(
             allFeeds.filter((e)=> typeof(e.url) == 'string' && e.url.length > 0).length
           ).toEqual(allFeeds.length);
         });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
         it('have non-empty names', function(){
           expect(
             allFeeds.filter((e)=> typeof(e.name) == 'string' && e.name.length > 0).length
           ).toEqual(allFeeds.length);
         });
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function(){
        var $menu;
        beforeEach(function(){
          $menu = $('.slide-menu');
        });
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
         it('is hidden by default', function(){
           expect(
             $menu.offset().left + $menu.width()
           ).toBeLessThan(0);
         });

         /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
          it('toggles visibility when hamburger icon is clicked', function(){
            //var spyEvent = spyOnEvent('.menu-icon-link', 'click');
            $('.menu-icon-link').trigger('click');
            /*expect('click').toHaveBeenTriggeredOn('.menu-icon-link');
            expect(spyEvent).toHaveBeenTriggered();*/

            expect(
              document.body.classList
            ).not.toContain('menu-hidden');

            $('.menu-icon-link').trigger('click');

            expect(
              document.body.classList
            ).toContain('menu-hidden');

          });
    });

    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function(){
        beforeEach(function(done){
          loadFeed(1, done);
        });
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
         it('successfully load with AJAX (at least one entry)', function(done){
           expect(
             $('.feed').find('.entry').length
           ).toBeGreaterThan(0);
           done();
         });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function(){
        var oldContents, startingId;
        beforeEach(function(done){
          //cache the entries from the starting RSS feed
          oldContents = Array.prototype.map.call($('.entry'),  e => $(e).html());
          //cache the feed id of the starting RSS feed
          startingId = findCurrentFeed();
          //compute a random next ID to load that is within the bounds of the number
          //of feeds we have
          var nextId = startingId;
          while(nextId === startingId){
            nextId = Math.round(Math.random()* $('.feed-list li').length);
          }
          //load this random feed
          loadFeed(nextId, done);
        });
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        it('actually changes content when loadFeed function is called', function(done){
          //make sure the current feed id is not equal to the one that was loaded
          //before this spec ran
          expect(findCurrentFeed()).not.toEqual(startingId);
          //Get an array of strings with the new feed contents
          var newContents = Array.prototype.map.call($('.entry'),  e => $(e).html());
          //make sure none of the old contents is still displayed after this new feed was loaded
          Array.prototype.forEach.call(oldContents, function(el, idx){
            expect(newContents).not.toContain(el);
          });
          done();
        });

        /*
          This function looks at the page title and compares it to the li's inside the
          side nav. Once it finds a match, it returns the feed id of the feed which is
          currently loaded according to the page title
        */
         function findCurrentFeed(){
           var titleOfFeed = document.querySelectorAll('.header-title')[0].innerHTML;
           return Array.prototype.reduce.call($('.feed-list li a'),
                (p,c) => $(c).html()==titleOfFeed ? $(c).data('id') : p, [] );
         }
    });
}());
