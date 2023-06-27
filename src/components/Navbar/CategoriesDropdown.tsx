import { Typography } from "@mui/material";
import { Category } from "../../context/ProductsContext";
import { useState } from "react";
import React from "react";

interface CategoriesDropdownProps {
  categories: Category[];
  onClick: (value: number) => void;
}

export const CategoriesDropdown = (props: CategoriesDropdownProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.categories.map((category) => (
        <CategoryItem
          key={category.categoryId}
          category={category}
          onClick={props.onClick}
        />
      ))}
    </div>
  );
};

interface CategoryItemProps {
  category: Category;
  onClick: (value: number) => void;
}

export const CategoryItem = (props: CategoryItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        marginBottom: "10px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ width: "100%" }}>
        <Typography
          sx={{
            fontSize: "15px",
            marginLeft: "15px",
            marginBottom: "5px",
            marginTop: "5px",
            cursor: "pointer",
            color: isHovered ? "black" : "inherit",
            fontWeight: isHovered ? "bold" : "normal",
            display: "inline-block",
          }}
        >
          {props.category.categoryName}
        </Typography>
        <div
          style={{
            border: "1px solid #e0e0e0",
            width: "auto",
          }}
        />
      </div>

      {isHovered && props.category.subCategories?.length! > 0 && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "100%",
            width: "250px",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
            zIndex: 1,
          }}
        >
          <SubCategoriesDropdown
            subCategories={props.category.subCategories}
            onClick={props.onClick}
          />
        </div>
      )}
    </div>
  );
};

interface SubCategoriesDropdownProps {
  subCategories: Category[] | null;
  onClick: (value: number) => void;
}

export const SubCategoriesDropdown = (props: SubCategoriesDropdownProps) => {
  const [hoveredSubCategoryId, setHoveredSubCategoryId] = useState<
    number | null
  >(null);

  const handleMouseEnter = (categoryId: number) => {
    setHoveredSubCategoryId(categoryId);
  };

  const handleMouseLeave = () => {
    setHoveredSubCategoryId(null);
  };

  const handleClick = (categoryId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    props.onClick(categoryId);
  };

  const renderSubcategory = (subCategory: Category) => {
    return (
      <div
        key={subCategory.categoryId}
        onMouseEnter={() => handleMouseEnter(subCategory.categoryId)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
        }}
        onClick={(event) => handleClick(subCategory.categoryId, event)}
      >
        <Typography
          sx={{
            fontSize: "15px",
            cursor: "pointer",
            marginTop: "10px",
            marginBottom: "10px",
            color:
              hoveredSubCategoryId === subCategory.categoryId
                ? "black"
                : "inherit",
            fontWeight:
              hoveredSubCategoryId === subCategory.categoryId
                ? "bold"
                : "normal",
          }}
        >
          {subCategory.categoryName}
        </Typography>
        <div
          style={{
            border: "1px solid #e0e0e0",
            width: "100%",
            marginLeft: "-15px",
          }}
        />
        {hoveredSubCategoryId === subCategory.categoryId &&
          subCategory.subCategories?.length! > 0 && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "100%",
                width: "250px",
                maxHeight: "250px",
                overflowY: "auto",
                backgroundColor: "white",
                padding: "20px",
                boxShadow: "0px 2px 4px rgba(100, 111, 203, 0.6)",
                zIndex: 1,
              }}
            >
              <SubCategoriesDropdown
                subCategories={subCategory.subCategories}
                onClick={props.onClick}
              />
            </div>
          )}
      </div>
    );
  };

  const renderSubcategories = (subCategories: Category[] | null) => {
    if (!subCategories || subCategories.length === 0) {
      return null;
    }

    return subCategories.map((subCategory) => (
      <React.Fragment key={subCategory.categoryId}>
        {renderSubcategory(subCategory)}
      </React.Fragment>
    ));
  };

  return <div>{renderSubcategories(props.subCategories)}</div>;
};
