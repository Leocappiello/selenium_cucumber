Feature: Búsqueda en Amazon

    Scenario: Buscar un producto en Amazon
        Given I open the Amazon homepage
        When I search for "laptop"
        Then I should see search results related to "laptop"
